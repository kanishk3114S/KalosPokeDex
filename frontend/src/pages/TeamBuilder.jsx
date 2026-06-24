import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const TeamBuilder = () => {
  const [teamName, setTeamName] = useState('My Awesome Team');
  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem('kalosTeam');
    return saved ? JSON.parse(saved) : Array(6).fill(null);
  });
  
  const [availablePokemon, setAvailablePokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('kalosTeam', JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    // Fetch Kalos Native and Megas
    const fetchPool = async () => {
      try {
        const [kalosRes, megaRes] = await Promise.all([
          axios.get(`https://pokeapi.co/api/v2/pokemon?limit=72&offset=649`),
          axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1500`)
        ]);

        let kalosList = kalosRes.data.results;
        let megaList = megaRes.data.results.filter(p => p.name.includes('-mega'));
        
        let combined = [...kalosList, { name: 'greninja-ash', url: 'https://pokeapi.co/api/v2/pokemon/10116/' }, ...megaList];
        
        // Fetch detailed stats for all to allow Analytics
        const detailed = await Promise.all(
          combined.map(async (p) => {
            const detailRes = await axios.get(p.url);
            const d = detailRes.data;
            const idStr = p.url.split('/').filter(Boolean).pop();
            return {
              name: p.name,
              id: parseInt(idStr),
              hp: d.stats[0].base_stat,
              attack: d.stats[1].base_stat,
              defense: d.stats[2].base_stat,
              spAtk: d.stats[3].base_stat,
              spDef: d.stats[4].base_stat,
              speed: d.stats[5].base_stat,
              sprite: d.sprites.other['official-artwork'].front_default || d.sprites.front_default,
              types: d.types.map(t => t.type.name)
            };
          })
        );
        
        setAvailablePokemon(detailed);
      } catch (err) {
        console.error("Failed fetching pool", err);
      }
    };
    fetchPool();
  }, []);

  const openModal = (index) => {
    setSelectedSlotIndex(index);
    setIsModalOpen(true);
  };

  const selectPokemon = (p) => {
    const newTeam = [...team];
    newTeam[selectedSlotIndex] = p;
    setTeam(newTeam);
    setIsModalOpen(false);
    setSearchTerm('');
  };

  const removePokemon = (index, e) => {
    e.stopPropagation();
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  };

  const calcAverage = (statName) => {
    const valid = team.filter(p => p !== null);
    if (valid.length === 0) return 0;
    const sum = valid.reduce((acc, p) => acc + p[statName], 0);
    return Math.round(sum / valid.length);
  };

  const validMembers = team.filter(p => p !== null);
  const totalBaseStats = validMembers.reduce((acc, p) => acc + p.hp + p.attack + p.defense + p.spAtk + p.spDef + p.speed, 0);

  const displayedPool = availablePokemon.filter(p => p.name.includes(searchTerm.toLowerCase()));

  return (
    <div className="container mx-auto px-6 pb-12">
      <div className="mb-10 border-b border-white/10 pb-8 flex flex-col items-center">
        <h2 className="text-3xl font-black mb-4 tracking-widest text-gray-300 uppercase">Team Builder</h2>
        <input 
          type="text" 
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="text-center text-xl font-bold bg-transparent border-b border-dashed border-gray-400 text-white focus:outline-none focus:border-[#00E5FF] transition-colors py-2"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {team.map((member, index) => (
          <div 
            key={index} 
            onClick={() => openModal(index)}
            className="glass aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#00E5FF] transition-all relative group overflow-hidden"
          >
            {member ? (
              <>
                <button 
                  onClick={(e) => removePokemon(index, e)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                  X
                </button>
                <img src={member.sprite} alt={member.name} className="w-24 h-24 object-contain drop-shadow-md mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-200 truncate w-full text-center px-2">
                  {member.name.replace('-', ' ')}
                </span>
              </>
            ) : (
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center text-gray-500 font-bold opacity-50 group-hover:text-[#00E5FF] group-hover:border-[#00E5FF] transition-colors">
                +
              </div>
            )}
          </div>
        ))}
      </div>

      {validMembers.length > 0 && (
        <div className="glass rounded-[2rem] p-10 mb-10 w-full max-w-4xl mx-auto">
          <h3 className="text-sm font-black mb-8 tracking-widest text-gray-300 uppercase text-center">Team Analytics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-200">
                <span>Average HP</span><span className="text-[#00E5FF]">{calcAverage('hp')}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1"><div className="bg-[#00E5FF] h-1 rounded-full" style={{ width: `${(calcAverage('hp')/255)*100}%` }}></div></div>

              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-200">
                <span>Average Attack</span><span className="text-[#00E5FF]">{calcAverage('attack')}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1"><div className="bg-[#00E5FF] h-1 rounded-full" style={{ width: `${(calcAverage('attack')/255)*100}%` }}></div></div>

              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-200">
                <span>Average Defense</span><span className="text-[#00E5FF]">{calcAverage('defense')}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1"><div className="bg-[#00E5FF] h-1 rounded-full" style={{ width: `${(calcAverage('defense')/255)*100}%` }}></div></div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-200">
                <span>Average Sp. Atk</span><span className="text-[#00E5FF]">{calcAverage('spAtk')}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1"><div className="bg-[#00E5FF] h-1 rounded-full" style={{ width: `${(calcAverage('spAtk')/255)*100}%` }}></div></div>

              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-200">
                <span>Average Sp. Def</span><span className="text-[#00E5FF]">{calcAverage('spDef')}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1"><div className="bg-[#00E5FF] h-1 rounded-full" style={{ width: `${(calcAverage('spDef')/255)*100}%` }}></div></div>

              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-200">
                <span>Average Speed</span><span className="text-[#00E5FF]">{calcAverage('speed')}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1"><div className="bg-[#00E5FF] h-1 rounded-full" style={{ width: `${(calcAverage('speed')/255)*100}%` }}></div></div>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Total Base Stats of Team</span>
            <div className="text-4xl font-black text-[#00E5FF] mt-2">{totalBaseStats}</div>
          </div>
        </div>
      )}

      {/* Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="glass w-full max-w-3xl max-h-[80vh] flex flex-col rounded-3xl overflow-hidden bg-black/50 border border-white/20"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-sm uppercase tracking-widest text-white">Select Pokémon</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-red-500 font-bold">Close</button>
              </div>
              
              <div className="p-4 border-b border-white/10">
                <input 
                  type="text" placeholder="Search by name..." 
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-transparent focus:outline-none focus:border-[#00E5FF] text-sm text-white"
                />
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {availablePokemon.length === 0 ? (
                  <div className="text-center py-10 text-xs tracking-widest uppercase text-gray-500">Loading Databanks...</div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {displayedPool.map(p => (
                      <div 
                        key={p.name} 
                        onClick={() => selectPokemon(p)}
                        className="flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer border border-transparent hover:border-white/20 transition-colors"
                      >
                        <img src={p.sprite} alt={p.name} className="w-16 h-16 object-contain mb-2 drop-shadow-sm" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-center truncate w-full text-gray-200">
                          {p.name.replace('-', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TeamBuilder;
