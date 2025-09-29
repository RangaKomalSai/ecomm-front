import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHeart, 
  faUser, 
  faShoppingBag, 
  faHeart as faWishlist, 
  faCrown, 
  faSignOutAlt,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons'

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
    <div className='sticky top-0 z-50 flex items-center justify-between py-3 font-medium bg-white/95 backdrop-blur-sm text-[#3d2b1f] shadow-lg border-b border-[#e8dccf] w-screen -ml-[calc(50vw-50%)] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      
      <Link to='/' onClick={scrollToTop} className='flex items-center gap-3'>
        <img src={assets.logo_icon} className='h-8' alt="Vesper Icon" draggable={false} />
        <img src={assets.logo_text} className='h-6' alt="Vesper" draggable={false} />
      </Link>

      <ul className='hidden sm:flex gap-4 text-sm md:text-sm lg:text-base text-[#3d2b1f]'>
        
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

      <div className='flex items-center gap-4'>
            <img onClick={()=> { setShowSearch(true); navigate('/collection'); scrollToTop() }} src={assets.search_icon} className='w-5 cursor-pointer' alt="" draggable={false} />
            <div className='group relative'>
                <div
                    onClick={() => {
                        if (!token) {
                            navigate('/login');
                            scrollToTop();
                        }
                    }}
                    className='flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity'
                >
                    <img
                        className='w-5 h-5'
                        src={assets.profile_icon}
                        alt="Profile"
                        draggable={false}
                    />
                    {token && (
                        <FontAwesomeIcon 
                            icon={faChevronDown} 
                            className='w-3 h-3 text-[#3d2b1f] group-hover:rotate-180 transition-transform duration-200' 
                        />
                    )}
                </div>
                
                {/* Enhanced Dropdown Menu */}
                {token && 
                <div className='group-hover:opacity-100 group-hover:visible opacity-0 invisible absolute dropdown-menu right-0 pt-4 transition-all duration-200 ease-in-out'>
                    <div className='bg-white border border-[#e8dccf] rounded-xl shadow-xl py-2 min-w-[200px] overflow-hidden'>
                        {/* User Info Header */}
                        <div className='px-4 py-3 border-b border-[#e8dccf] bg-gradient-to-r from-[#f5ece3] to-[#fdf7f0]'>
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-8 bg-[#3d2b1f] rounded-full flex items-center justify-center'>
                                    <FontAwesomeIcon icon={faUser} className='w-4 h-4 text-white' />
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-[#3d2b1f]'>My Account</p>
                                    <p className='text-xs text-[#3d2b1f] opacity-70'>Manage your profile</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Menu Items */}
                        <div className='py-2'>
                            <div 
                                onClick={()=>{navigate('/profile'); scrollToTop()}} 
                                className='flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#f5ece3] transition-colors group/item'
                            >
                                <FontAwesomeIcon icon={faUser} className='w-4 h-4 text-[#3d2b1f] group-hover/item:text-[#5a3c2c] transition-colors' />
                                <span className='text-sm text-[#3d2b1f] group-hover/item:text-[#5a3c2c] transition-colors'>My Profile</span>
                            </div>
                            
                            <div 
                                onClick={()=>{navigate('/orders'); scrollToTop()}} 
                                className='flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#f5ece3] transition-colors group/item'
                            >
                                <FontAwesomeIcon icon={faShoppingBag} className='w-4 h-4 text-[#3d2b1f] group-hover/item:text-[#5a3c2c] transition-colors' />
                                <span className='text-sm text-[#3d2b1f] group-hover/item:text-[#5a3c2c] transition-colors'>My Orders</span>
                            </div>
                            
                            <div 
                                onClick={()=>{navigate('/wishlist'); scrollToTop()}} 
                                className='flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#f5ece3] transition-colors group/item'
                            >
                                <FontAwesomeIcon icon={faWishlist} className='w-4 h-4 text-[#3d2b1f] group-hover/item:text-[#5a3c2c] transition-colors' />
                                <span className='text-sm text-[#3d2b1f] group-hover/item:text-[#5a3c2c] transition-colors'>Wishlist</span>
                                {wishlist.length > 0 && (
                                    <span className='ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full'>{wishlist.length}</span>
                                )}
                            </div>
                            
                            <div 
                                onClick={()=>{navigate('/subscription-plans'); scrollToTop()}} 
                                className='flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#f5ece3] transition-colors group/item'
                            >
                                <FontAwesomeIcon icon={faCrown} className='w-4 h-4 text-[#3d2b1f] group-hover/item:text-[#5a3c2c] transition-colors' />
                                <span className='text-sm text-[#3d2b1f] group-hover/item:text-[#5a3c2c] transition-colors'>Subscription Plans</span>
                            </div>
                            
                            <div className='border-t border-[#e8dccf] my-2'></div>
                            
                            <div 
                                onClick={logout} 
                                className='flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-red-50 transition-colors group/item'
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className='w-4 h-4 text-red-600 group-hover/item:text-red-700 transition-colors' />
                                <span className='text-sm text-red-600 group-hover/item:text-red-700 transition-colors'>Logout</span>
                            </div>
                        </div>
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

        {/* Enhanced Sidebar menu for small screens */}
        <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-[#fdf7f0] transition-all duration-300 ${visible ? 'w-full' : 'w-0'}`}>
            <div className='flex flex-col text-[#3d2b1f] h-full'>
                {/* Header */}
                <div className='flex items-center justify-between p-4 border-b border-[#e8dccf] bg-gradient-to-r from-[#f5ece3] to-[#fdf7f0]'>
                    <div className='flex items-center gap-3'>
                        <img src={assets.logo_icon} className='h-8' alt="Vesper Icon" draggable={false} />
                        <span className='font-bold text-[#3d2b1f]'>Menu</span>
                    </div>
                    <button onClick={()=>setVisible(false)} className='p-2 hover:bg-[#e8dccf] rounded-full transition-colors'>
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" draggable={false} />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className='flex-1 py-4'>
                    <NavLink onClick={()=>{setVisible(false); scrollToTop()}} className='flex items-center gap-3 py-3 px-6 border-b border-[#e8dccf] hover:bg-[#e8dccf] transition-colors group/item'>
                        <span className='text-sm font-medium'>HOME</span>
                    </NavLink>
                    <NavLink onClick={()=>{setVisible(false); scrollToTop()}} className='flex items-center gap-3 py-3 px-6 border-b border-[#e8dccf] hover:bg-[#e8dccf] transition-colors group/item'>
                        <span className='text-sm font-medium'>COLLECTION</span>
                    </NavLink>
                    <NavLink onClick={()=>{setVisible(false); scrollToTop()}} className='flex items-center gap-3 py-3 px-6 border-b border-[#e8dccf] hover:bg-[#e8dccf] transition-colors group/item'>
                        <span className='text-sm font-medium'>ABOUT</span>
                    </NavLink>
                    <NavLink onClick={()=>{setVisible(false); scrollToTop()}} className='flex items-center gap-3 py-3 px-6 border-b border-[#e8dccf] hover:bg-[#e8dccf] transition-colors group/item'>
                        <span className='text-sm font-medium'>CONTACT</span>
                    </NavLink>
                    <NavLink onClick={()=>{setVisible(false); scrollToTop()}} className='flex items-center gap-3 py-3 px-6 border-b border-[#e8dccf] hover:bg-[#e8dccf] transition-colors group/item'>
                        <span className='text-sm font-medium'>PLANS</span>
                    </NavLink>
                </div>

                {/* User Account Section (if logged in) */}
                {token && (
                    <div className='border-t border-[#e8dccf] bg-white'>
                        <div className='px-6 py-4 border-b border-[#e8dccf] bg-gradient-to-r from-[#f5ece3] to-[#fdf7f0]'>
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-8 bg-[#3d2b1f] rounded-full flex items-center justify-center'>
                                    <FontAwesomeIcon icon={faUser} className='w-4 h-4 text-white' />
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-[#3d2b1f]'>My Account</p>
                                    <p className='text-xs text-[#3d2b1f] opacity-70'>Manage your profile</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className='py-2'>
                            <div onClick={()=>{navigate('/profile'); setVisible(false); scrollToTop()}} className='flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-[#e8dccf] transition-colors group/item'>
                                <FontAwesomeIcon icon={faUser} className='w-4 h-4 text-[#3d2b1f]' />
                                <span className='text-sm text-[#3d2b1f]'>My Profile</span>
                            </div>
                            
                            <div onClick={()=>{navigate('/orders'); setVisible(false); scrollToTop()}} className='flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-[#e8dccf] transition-colors group/item'>
                                <FontAwesomeIcon icon={faShoppingBag} className='w-4 h-4 text-[#3d2b1f]' />
                                <span className='text-sm text-[#3d2b1f]'>My Orders</span>
                            </div>
                            
                            <div onClick={()=>{navigate('/wishlist'); setVisible(false); scrollToTop()}} className='flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-[#e8dccf] transition-colors group/item'>
                                <FontAwesomeIcon icon={faWishlist} className='w-4 h-4 text-[#3d2b1f]' />
                                <span className='text-sm text-[#3d2b1f]'>Wishlist</span>
                                {wishlist.length > 0 && (
                                    <span className='ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full'>{wishlist.length}</span>
                                )}
                            </div>
                            
                            <div onClick={()=>{navigate('/subscription-plans'); setVisible(false); scrollToTop()}} className='flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-[#e8dccf] transition-colors group/item'>
                                <FontAwesomeIcon icon={faCrown} className='w-4 h-4 text-[#3d2b1f]' />
                                <span className='text-sm text-[#3d2b1f]'>Subscription Plans</span>
                            </div>
                            
                            <div className='border-t border-[#e8dccf] my-2'></div>
                            
                            <div onClick={()=>{logout(); setVisible(false)}} className='flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-red-50 transition-colors group/item'>
                                <FontAwesomeIcon icon={faSignOutAlt} className='w-4 h-4 text-red-600' />
                                <span className='text-sm text-red-600'>Logout</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    </div>
  )
}

export default Navbar
