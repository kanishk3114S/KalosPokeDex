import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const PokemonDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { isShiny } = useTheme();
  const [data, setData] = useState(null);
  const [trivia, setTrivia] = useState('');
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [loading, setLoading] = useState(true);

  const parseEvoDetails = (details) => {
    if (!details || details.length === 0) return '';
    const d = details[0];
    let conditions = [];
    if (d.min_level) conditions.push(`Lv. ${d.min_level}`);
    if (d.item) conditions.push(`${d.item.name.replace('-', ' ')}`);
    if (d.trigger?.name === 'trade') conditions.push('Trade');
    if (d.min_happiness) conditions.push('High Friendship');
    if (d.known_move) conditions.push(`Knows ${d.known_move.name.replace('-',' ')}`);
    if (d.needs_overworld_rain) conditions.push('Rain');
    if (d.time_of_day) conditions.push(d.time_of_day);
    return conditions.join(' + ') || 'Special';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const pkmnRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setData(pkmnRes.data);

        let speciesName = pkmnRes.data.species.name;
        const speciesRes = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${speciesName}`);
        
        // Extract Trivia
        const engFlavors = speciesRes.data.flavor_text_entries.filter(f => f.language.name === 'en');
        if (engFlavors.length > 0) {
          // Clean up weird characters (form feeds, newlines)
          const cleanTrivia = engFlavors[0].flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ');
          setTrivia(cleanTrivia);
        }

        const evoRes = await axios.get(speciesRes.data.evolution_chain.url);
        
        const evoList = [];
        const traverse = (node, preReq = null) => {
          const evoId = node.species.url.split('/').filter(Boolean).pop();
          evoList.push({
            name: node.species.name,
            id: evoId,
            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoId}.png`,
            shinyUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${evoId}.png`,
            requirement: preReq
          });

          if (node.species.name === 'greninja') {
            evoList.push({
              name: 'greninja-ash',
              id: '10116',
              imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10116.png`,
              shinyUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/10116.png`,
              requirement: 'Battle Bond'
            });
          }

          if (node.evolves_to && node.evolves_to.length > 0) {
            node.evolves_to.forEach(nextEvo => {
              const req = parseEvoDetails(nextEvo.evolution_details);
              traverse(nextEvo, req);
            });
          }
        };
        traverse(evoRes.data.chain);
        setEvolutionChain(evoList);

      } catch (err) {
        console.error("Failed to fetch details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, navigate]);

  if (loading || !data) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  let displayName = data.name;
  let numericId = data.id;
  let formattedId = `#${String(numericId).padStart(4, '0')}`;
  
  if (data.name === 'greninja-ash') {
    displayName = 'ASH-GRENINJA';
    formattedId = '#0658-A';
  }

  const normalImg = data.sprites.other['official-artwork'].front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${numericId}.png`;
  const shinyImg = data.sprites.other['official-artwork'].front_shiny || normalImg;
  const displayImg = isShiny ? shinyImg : normalImg;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="container mx-auto px-6 pb-12 relative"
    >
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 px-5 py-2 flex items-center gap-2 text-xs font-bold tracking-widest uppercase border border-white/20 text-gray-300 rounded-full hover:bg-white/10 transition-colors w-fit cursor-pointer"
      >
        &larr; Go Back
      </button>

      <div className="glass rounded-[2rem] p-10 mb-10 flex flex-col md:flex-row gap-16 items-center relative overflow-hidden">
        <div className="flex-1 flex flex-col items-center relative z-10">
          <motion.div 
            key={displayImg}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#00E5FF] rounded-full opacity-5 blur-3xl"></div>
            <img src={displayImg} alt={displayName} className="w-80 h-80 object-contain drop-shadow-lg relative z-10" />
          </motion.div>
          <div className="mt-6 px-4 py-1 border border-white/20 rounded-full text-[10px] font-bold tracking-widest text-gray-300 uppercase bg-black/20">
            {isShiny ? 'Shiny Variant Active' : 'Standard Variant'}
          </div>
        </div>

        <div className="flex-1 w-full relative z-10 text-center md:text-left">
          <p className="text-xl font-bold text-[#00E5FF] mb-2 tracking-widest">{formattedId}</p>
          <h1 className="text-5xl font-black uppercase mb-6 tracking-tighter text-white">
            {displayName.replace('-', ' ')}
          </h1>
          
          {trivia && (
            <div className="mb-8 p-4 rounded-xl border border-white/10 bg-white/5 text-gray-300 text-sm font-medium leading-relaxed italic">
              "{trivia}"
            </div>
          )}

          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-10">
            {data.types.map(t => (
              <span key={t.type.name} className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-white/20 bg-white/10 text-white">
                {t.type.name}
              </span>
            ))}
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-bold mb-4 tracking-widest text-gray-400 uppercase">Classified Abilities</h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {data.abilities.map(a => (
                <div key={a.ability.name} className="glass px-5 py-2 rounded-lg uppercase tracking-wider font-bold text-xs text-white">
                  {a.ability.name.replace('-', ' ')}
                  {a.is_hidden && <span className="ml-2 text-[9px] text-[#00E5FF]">(Hidden)</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-[2rem] p-10 mb-10 w-full flex flex-col items-center">
        <h3 className="text-lg font-black mb-10 tracking-widest text-gray-300 uppercase text-center w-full">Evolutionary Lineage</h3>
        <div className="flex items-center justify-center gap-4 flex-wrap w-full">
          {evolutionChain.map((evo) => (
            <React.Fragment key={evo.name}>
              {evo.requirement && (
                <div className="flex flex-col items-center mx-4 mb-6">
                  <span className="text-[#00E5FF] font-black text-xl mb-2">&rarr;</span>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-gray-300 bg-white/5 px-3 py-1.5 rounded-md border border-white/10 text-center max-w-[120px] leading-relaxed">
                    {evo.requirement}
                  </span>
                </div>
              )}
              <div 
                onClick={() => navigate(`/pokemon/${evo.name}`)}
                className="flex flex-col items-center cursor-pointer group mb-6 p-4 rounded-2xl transition-all border border-transparent hover:border-white/20 hover:bg-white/5"
              >
                <div className="w-24 h-24 relative mb-3 flex items-center justify-center">
                  <img 
                    src={isShiny ? evo.shinyUrl : evo.imageUrl} 
                    alt={evo.name} 
                    className="relative z-10 w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" 
                  />
                </div>
                <span className="uppercase font-bold tracking-widest text-[10px] text-gray-200">
                  {evo.name === 'greninja-ash' ? 'ASH-GRENINJA' : evo.name}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="glass rounded-[2rem] p-10 mb-10 w-full">
        <h3 className="text-lg font-black mb-10 tracking-widest text-gray-300 uppercase text-center">Combat Statistics</h3>
        <div className="space-y-6 max-w-3xl mx-auto">
          {data.stats.map(s => (
            <div key={s.stat.name}>
              <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest text-gray-200">
                <span>{s.stat.name.replace('-', ' ')}</span>
                <span className="text-[#00E5FF]">{s.base_stat}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-[#00E5FF] h-2 rounded-full" style={{ width: `${Math.min((s.base_stat / 255) * 100, 100)}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
};

export default PokemonDetail;
