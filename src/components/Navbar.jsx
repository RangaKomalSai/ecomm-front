import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const Navbar = () => {

    const [visible,setVisible] = useState(false);

    const {setShowSearch , getCartCount , navigate, token, setToken, setCartItems, wishlist} = useContext(ShopContext);

    const logout = () => {
        navigate('/login')
        scrollToTop()
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }

  return (
    <div className='sticky top-0 z-50 flex items-center justify-between py-5 font-medium bg-white/95 backdrop-blur-sm text-[#3d2b1f] shadow-lg border-b border-[#e8dccf] w-screen -ml-[calc(50vw-50%)] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      
      <Link to='/' onClick={scrollToTop} className='flex items-center gap-3'>
        <img src={assets.logo_icon} className='h-12' alt="Vesper Icon" draggable={false} />
        <img src={assets.logo_text} className='h-8' alt="Vesper" draggable={false} />
      </Link>

      <ul className='hidden sm:flex gap-5 text-sm lg:text-base text-[#3d2b1f]'>
        
        <NavLink to='/' onClick={scrollToTop} className='flex flex-col items-center gap-1 hover:text-[#5a3c2c] transition-colors'>
            <p>HOME</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-[#3d2b1f] hidden' />
        </NavLink>
        <NavLink to='/collection' onClick={scrollToTop} className='flex flex-col items-center gap-1 hover:text-[#5a3c2c] transition-colors'>
            <p>COLLECTION</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-[#3d2b1f] hidden' />
        </NavLink>
        <NavLink to='/about' onClick={scrollToTop} className='flex flex-col items-center gap-1 hover:text-[#5a3c2c] transition-colors'>
            <p>ABOUT</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-[#3d2b1f] hidden' />
        </NavLink>
        <NavLink to='/contact' onClick={scrollToTop} className='flex flex-col items-center gap-1 hover:text-[#5a3c2c] transition-colors'>
            <p>CONTACT</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-[#3d2b1f] hidden' />
        </NavLink>
        <NavLink to='/subscription-plans' onClick={scrollToTop} className='flex flex-col items-center gap-1 hover:text-[#5a3c2c] transition-colors'>
            <p>PLANS</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-[#3d2b1f] hidden' />
        </NavLink>

      </ul>

      <div className='flex items-center gap-6'>
            <img onClick={()=> { setShowSearch(true); navigate('/collection'); scrollToTop() }} src={assets.search_icon} className='w-5 cursor-pointer' alt="" draggable={false} />
            <div className='group relative'>
                <img
                    onClick={() => {
                        if (!token) {
                            navigate('/login');
                            scrollToTop();
                        }
                    }}
                    className='w-5 cursor-pointer'
                    src={assets.profile_icon}
                    alt=""
                    draggable={false}
                />
                {/* Dropdown Menu */}
                {token && 
                <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                    <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-[#f5ece3] text-[#3d2b1f] rounded shadow-lg'>
                        <p onClick={()=>{navigate('/profile'); scrollToTop()}} className='cursor-pointer hover:text-[#5a3c2c] transition-colors'>My Profile</p>
                        <p onClick={()=>{navigate('/orders'); scrollToTop()}} className='cursor-pointer hover:text-[#5a3c2c] transition-colors'>Orders</p>
                        <p onClick={()=>{navigate('/wishlist'); scrollToTop()}} className='cursor-pointer hover:text-[#5a3c2c] transition-colors'>Wishlist</p>
                        <p onClick={()=>{navigate('/subscription-plans'); scrollToTop()}} className='cursor-pointer hover:text-[#5a3c2c] transition-colors'>Plans</p>
                        <p onClick={logout} className='cursor-pointer hover:text-[#5a3c2c] transition-colors'>Logout</p>
                    </div>
                </div>}
            </div> 
            {token && (
                <Link to='/wishlist' onClick={scrollToTop} className='relative'>
                    <FontAwesomeIcon icon={faHeart} className='w-5 h-5 text-red-500' />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-red-500 text-white aspect-square rounded-full text-[8px]'>{wishlist.length}</p>
                </Link>
            )}
            <Link to='/cart' onClick={scrollToTop} className='relative'>
                <img src={assets.cart_icon} className='w-5 min-w-5' alt="" draggable={false} />
                <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-[#3d2b1f] text-[#fdf7f0] aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
            </Link> 
            <img onClick={()=>setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" draggable={false} /> 
      </div>

        {/* Sidebar menu for small screens */}
        <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-[#fdf7f0] transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-[#3d2b1f]'>
                    <div onClick={()=>setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer hover:bg-[#e8dccf] transition-colors'>
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" draggable={false} />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={()=>{setVisible(false); scrollToTop()}} className='py-2 pl-6 border-b border-[#e8dccf] hover:bg-[#e8dccf] transition-colors' to='/'>HOME</NavLink>
                    <NavLink onClick={()=>{setVisible(false); scrollToTop()}} className='py-2 pl-6 border-b border-[#e8dccf] hover:bg-[#e8dccf] transition-colors' to='/collection'>COLLECTION</NavLink>
                    <NavLink onClick={()=>{setVisible(false); scrollToTop()}} className='py-2 pl-6 border-b border-[#e8dccf] hover:bg-[#e8dccf] transition-colors' to='/about'>ABOUT</NavLink>
                    <NavLink onClick={()=>{setVisible(false); scrollToTop()}} className='py-2 pl-6 border-b border-[#e8dccf] hover:bg-[#e8dccf] transition-colors' to='/contact'>CONTACT</NavLink>
                    <NavLink onClick={()=>{setVisible(false); scrollToTop()}} className='py-2 pl-6 border-b border-[#e8dccf] hover:bg-[#e8dccf] transition-colors' to='/subscription-plans'>PLANS</NavLink>
                </div>
        </div>

    </div>
  )
}

export default Navbar
