'use client'
import { HeartIcon } from "@heroicons/react/outline";
import { useState } from "react";

export default function LikeButton(){
    


    const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);

  };
    return (
        <div>
            <HeartIcon
                className='h-5 w-5 cursor-pointer'
                style={{ color: clicked ? 'red' : 'currentColor' }}
                onClick={handleClick}
      />
    </div>
        
    )
}