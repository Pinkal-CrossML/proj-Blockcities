import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Menu, Modal } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import { Notifications } from '../Notifications';
import useWindowDimensions from '../../utils/layout';
import { MenuOutlined } from '@ant-design/icons';
import { HowToBuyModal } from '../HowToBuyModal';
import {
  Cog,
  CurrentUserBadge,
  CurrentUserBadgeMobile,
} from '../CurrentUserBadge';
import { ConnectButton } from '@oyster/common';
import { MobileNavbar } from '../MobileNavbar';
import classNames from 'classnames';

const getDefaultLinkActions = (connected: boolean) => {
  return [
    
    <Link to={`/`} key={'explore'}>
      <Button className="app-btn index-nav-map fs-5 fw-normal ms-4">Map</Button>
    </Link>,
    <Link to={`/`} key={'explore'}>
      
      <div className="nav-back-icon">
        <div className='ms-5'>
          <img style={{width: '15%'}} src={'/H1.png'} />
      <Button className="app-btn nave-list fs-5 fw-normal mb-3 ">Home</Button></div>
      
      </div>
    </Link>,
    
    <Link to={`/`} key={'explore'}>
      <div className='ms-5'>
      <img style={{width: '12%'}} src={'/market.png'} />
    <Button className="app-btn nave-list fs-5 fw-normal mb-3 ">Marketplace</Button>
      </div>
      
  </Link>,
    <Link to={`/artworks`} key={'artwork'}>
      <div className='ms-5'>
      <img style={{width: '12%'}} src={'/activity.png'} />
      <Button className="app-btn nave-list fs-5 fw-normal mb-3">{connected ? 'My Activity' : 'Artwork'}</Button>
      </div>
      
    </Link>,
    <Link to={""} key={'artists'}>
      <Button className="app-btn index-nav-map fs-5 fw-normal mb-0 ms-3 ">Account</Button>

    
  </Link>,
    <Link to={`/artists`} key={'artists'}>
      <div className='ms-5'>
      <img style={{width: '12%'}}  src={'/Vector.png'} />
      <Button className="app-btn nave-list fs-5 fw-normal mb-3">My Wallet</Button>
      </div>
      
    </Link>,
    <Link to={`/artists`} key={'artists'}>
      <div className='ms-5'>
      <img style={{width: '12%'}}  src={'/settings.png'} />
    <Button className="app-btn nave-list fs-5 fw-normal mb-3">Settings</Button>
      </div>
    
  </Link>,
   <Link to={`/artists`} key={'artists'}>
     <div className='ms-5'>
   <img style={{width: '8%'}} src={'/logout.png'} />
   <Button className="app-btn nave-list fs-5 fw-normal ">Logout</Button></div>
   <div className="img-div pt-0 pb-4">
            <img className='img1 ms-4 mt-5 pt-1' src={"/Bg (1).png"} />
            <img className='img2'src={"/Ornament.png"}/>
            <img className='img3 pt-1' src={"/VIP.png"} /> 
    
            <Link className="white-grad fs-6 buy-now-btn"
                      // key={auctionView.auction.pubkey}
                      to={`/auction/`}
                    >Join Now</Link>
            
        </div>
   
 </Link>,
 

  ];
};

const DefaultActions = ({ vertical = true }: { vertical?: boolean }) => {
  const { connected } = useWallet();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
      }}
    >
      {getDefaultLinkActions(connected)}
    </div>
  );
};

export const MetaplexMenu = () => {
  const { width } = useWindowDimensions();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { connected } = useWallet();

  if (width < 1648)
    return (
      <>
        <Modal
        
          title={<img className='menu-logo' src={'/blockcities-logo.png'} />}
          visible={isModalVisible}
          footer={null}
          className={'modal-box'}
          closeIcon={
            <img
              onClick={() => setIsModalVisible(false)}
              src={'/modals/close.svg'}
            />
          }
        >
          <div className="site-card-wrapper mobile-menu-modal">
            <Menu onClick={() => setIsModalVisible(false)}>
              {getDefaultLinkActions(connected).map((item, idx) => (
                <Menu.Item key={idx}>{item}</Menu.Item>
              ))}
            </Menu>
            <div className="actions">
              {!connected ? (
                <div className="actions-buttons">
                  <ConnectButton
                    onClick={() => setIsModalVisible(false)}
                    className="secondary-btn"
                  />
                  <HowToBuyModal
                    onClick={() => setIsModalVisible(false)}
                    buttonClassName="black-btn"
                  />
                </div>
              ) : (
                <>
                  <CurrentUserBadgeMobile
                    showBalance={false}
                    showAddress={true}
                    iconSize={24}
                    closeModal={() => {
                      setIsModalVisible(false);
                    }}
                  />
                  <Notifications />
                  <Cog />
                </>
              )}
            </div>
          </div>
        </Modal>
        <MenuOutlined
          onClick={() => setIsModalVisible(true)}
          style={{ fontSize: '1.4rem' }}
        />
      </>
    );

  return <DefaultActions />;
};

export const LogoLink = () => {
  return (
    <Link to={`/`}>
      <div className='ms-4'>
      <img className='main-icon' src={'/Bg.png'} />
      <img className='main-logo' src={'/blockcities-logo.png'} />
      </div>
      
    </Link>
  );
};

export const AppBar = () => {
  const img1Style=
    {
      
    }
    
  const { connected } = useWallet();
  return (
    <>
      <MobileNavbar />
      <div className='' id="desktop-navbar">
        <div>
          <LogoLink /> 
          {/* &nbsp;&nbsp;&nbsp; */}
          <MetaplexMenu />

        </div>
      
        <div className="app-right">
          {!connected && (
            <HowToBuyModal buttonClassName="modal-button-default" />
          )}
          {!connected && (
            <ConnectButton style={{ height: 48 }} allowWalletChange />
          )}
          {connected && (
            <>
              <CurrentUserBadge
                showBalance={false}
                showAddress={true}
                iconSize={24}
              />
              <Notifications />
              <Cog />
            </>
          )}
        </div>
      </div>

      
    </>
  );
};
{/* <h6 className='text-white'>JOIN VIP For Special Perks</h6> */}