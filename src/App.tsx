'use client'

import React, { useEffect, useState } from 'react';
import './App.css'
import Hamster from './icons/Hamster'
import Info from './icons/Info';
import Settings from './icons/Settings';
import Friends from './icons/Friends';

import gem from "./images/gem (1).png"
import gmcont from "./images/game-controller (2).png"
import hamsterExchange from "./images/hamster-exchange.png";
import binanceLogo from "./images/binance-logo.png";
import dollarCoin from "./images/dollar-coin.png";
import dailyReward from "./images/daily-reward.png";
import dailyCipher from "./images/daily-cipher.png";
import dailyCombo from "./images/daily-combo.png";
import mainCharacter from "./images/main-character.png";
import hamsterCoin from "./images/hamster-coin.png";
import Coinper from "./images/coin.png";
import frog from "./images/frog.png"

export {
    gem,
    gmcont,
    frog,
    Coinper,
    hamsterExchange,
    binanceLogo,
    dollarCoin,
    dailyReward,
    dailyCipher,
    dailyCombo,
    mainCharacter,
    hamsterCoin
};

function App() {



  const levelNames = [
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Epic",
    "Legendary",
    "Master",
    "GrandMaster",
    "Lord"
  ];

  const levelMinPoints = [
    0,
    5000,
    25000,
    100000,
    1000000,
    10000000,
    20000000,
    100000000,
    500000000,
    1000000000,
    10000000000
  ];

  const [levelIndex, setLevelIndex] = useState(6);
  const [points, setPoints] = useState(0);
  const profitPerHour = 1;
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>
  ([]);
  const pointsToAdd = 1;

  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  const [user, setUser] = useState<any>(null)
  const [, setError] = useState<string | null>(null)
  const [, setnotofication] = useState('')

  const calculateTimeLeft = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);

    if (now.getUTCHours() >= targetHour) {
      target.setUTCDate(target.getUTCDate() + 1);
    }

    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    

    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}`;
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000);

    return () => clearInterval(interval);
}, []);

  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };

  const handleIncreasePoints = async (e: React.MouseEvent<HTMLDivElement>) => {

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      card.style.transform = '';
    }, 100);

    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);

    if (!user) return 

    try {
      const res = await fetch('/api/increase-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegramId: user.telegramId }),
      })
      const data = await res.json()
      if (data.success) {
        setUser({ ...user, points: data.points })
        setnotofication('Points increased successfully!')
        setTimeout(() => setnotofication(''), 3000)
      } else {
        setError('Failed to increase points')
      }
    } catch (err) {
      setError('An error ocurred while increasing points')
    }
  }

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelMinPoints, levelNames.length]);

  useEffect(() => {
    const pointsPerSecond = Math.floor(profitPerHour / 3600);
    const interval = setInterval(() => {
      setPoints(prevPoints => prevPoints + pointsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [profitPerHour]);
  

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
         
         <div className="px-4 z-10">

          <div className="flex items-center space-x-2 pt-4">
            <div className="p-1 rounded-lg bg-[#1d2025]">
              <Hamster size={24} className="text-[#d4d4d4]" />
            </div>
            <div>
              <h1 className="text-sm">{user.username} (CEO)</h1>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-4 mt-1">
            <div className="flex items-center w-1/3">
            <div className="w-full">
              <div className="flex justify-between">
                <p className="text-sm">{levelNames[levelIndex]}</p>
                <p className="text-sm">{levelIndex + 1} <span
                className="text-[#95908a]">/ {levelNames.length}</span></p>
              </div>
              <div className='flex items-center mt-1 border-2 border-[#43433b] rounded-full'>
                <div className='w-full h-2 bg-[#43433b]/[0.6] rounded-full'>
                <div className='progress-gradient h-2 rounded-full' style={{ width: `${calculateProgress()}%` }}></div>
                </div>
              </div>
          </div>
         </div>
         <div className='flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-2-64'>
         <img src={binanceLogo} alt="Exchange" className='w-8 h-8' />
         <div className='flex-1 text-center'>
          <p className='text-xs text-[#85827d] font-medium'>Profit per hour</p>
          <div className='flex items-center justify-center space-x-1'>
            <img src={Coinper} alt="Dollar Coin" className='w-[18px] h-[18px]' />
            <p className='text-sm'>{formatProfitPerHour(profitPerHour)}</p>
            <Info size={20} className='text-[#43433b]' />
          </div>
         </div>
         <Settings className='text-white' />
         </div>
        </div>

       </div>

       <div className='flex-grow mt-4 bg-[#87cefa] rounded-t-[48px] relative top-glow z-0'>
        <div className='absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]'>

          <div className='px-4 mt-6 flex justify-between gap-2'>
            <div className='bg-[#272a2f] rounded-lg px-4 py-2 w-full relative'>
              <div className='dot'></div>
              <img src={dailyReward} alt="Daily Reward" className='mx-auto w-12 h-12' />
              <p className='text-[10px] text-center text-white mt-1'>Daily Reward</p>
              <p className='text-[10px] font-medium text-center text-gray-400 mt-2'>{dailyRewardTimeLeft}</p>
            </div>
            <div className='bg-[#272a2f] rounded-lg px-4 py-2 w-full relative'>
              <div className='dot'></div>
              <img src={dailyCipher} alt="Daily Cipher" className='mx-auto w-12 h-12' />
              <p className='text-[10px] text-center text-white mt-1'>Daily Cipher</p>
              <p className='text-[10px] font-medium text-center text-gray-400 mt-2'>{dailyCipherTimeLeft}</p>
            </div>
            <div className='bg-[#272a2f] rounded-lg px-4 py-2 w-full relative'>
              <div className='dot'></div>
              <img src={dailyCombo} alt="Daily Combo" className='mx-auto w-12 h-12' />
              <p className='text-[10px] text-center text-white mt-1'>Daily Combo</p>
              <p className='text-[10px] font-medium text-center text-gray-400 mt-2'>{dailyComboTimeLeft}</p>
            </div>
          </div>

          <div className='px-4 mt-4 flex justify-center'>
            <div className='px-4 py-2 flex items-center space-x-2'>
              <img src={Coinper} alt="Dollar Coin" className='w-10 h-10' />
              <p className='text-4xl text-white'>{user.points}</p>
            </div>
          </div>

          <div className='px-4 mt-4 flex justify-center'>
            <div
            className='w-80 h-80 p-4 rounded-full circle-outer'
            onClick={handleIncreasePoints}
            >
              <div className='w-full h-full rounded-full circle-inner'>
                <img src={frog} alt="Main Character"
                className='w-full h-full' />
              </div>
            </div>
          </div>


        </div>
       </div>
      </div>
      
      <div className='fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs'>
        <div className='text-center text-[#85827d] w-1/5 bg-[#1c1f24] m-1 p-2 rounded-2xl'>
         <img src={binanceLogo} alt="Exchange" className='w-8 h-8 mx-auto' />
         <p className='mt-1'>Exchange</p>
        </div>
        <div className='text-center text-[#85827d] w-1/5'>
         <img src={gmcont} className='w-8 h-8 mx-auto' />
         <p className='mt-1'>Playground</p>
        </div>
        <div className='text-center text-[#85827d] w-1/5'>
         <img src={hamsterCoin} className='w-8 h-8 mx-auto' />
         <p className='mt-1'>Airdrop</p>
        </div>
         <div className='text-center text-[#85827d] w-1/5'>
         <Friends className='w-8 h-8 mx-auto' />
         <p className='mt-1'>Friends</p>
        </div>
        <div className='text-center text-[#85827d] w-1/5'>
         <img src={gem} className='w-8 h-8 mx-auto' />
         <p className='mt-1'>Earn</p>
        </div>
      </div>

      {clicks.map((click) => (
        <div
        key={click.id}
        className='absolute text-5xl font-bold opacity-0 text-white pointer-events-none'
        style={{
          top: `${click.y - 42}px`,
          left: `${click.x - 28}px`,
          animation: `float 1s ease-out`
        }}
        onAnimationEnd={() => handleAnimationEnd(click.id)}
        >
          {pointsToAdd}
        </div>
      ))}



    </div>
  )
}

export default App
