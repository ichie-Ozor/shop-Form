// Improved Certificate.js with Base64 image conversion for better PDF compatibility

import React, { useEffect, useState } from 'react';
import "@fontsource/comfortaa/700.css";
import logoImage from "./image/logo2.png";
import waterMarkImage from "./image/watermark2.jpg";
import verify from "./verified-removebg-preview.png";
import signature from "./signature.png";
import { QRCode } from 'react-qr-code';
import moment from 'moment';
import axios from 'axios';

// Improved image handling component with Base64 conversion for localhost URLs
const ImageWithFallback = ({ src, alt, style, fallbackText }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(src && src.includes('localhost'));
  const [loadingDetails, setLoadingDetails] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    // Reset state when src changes
    setHasError(false);
    setLoadingDetails('');
    
    // Convert localhost URLs to base64 for better PDF compatibility
    const convertToBase64 = async () => {
      try {
        console.log(`Attempting to load image from: ${src}`);
        setLoadingDetails('Fetching image...');

        // For images from your server
        const response = await axios.get(src, { 
          responseType: 'blob',
          timeout: 5000  // Increased timeout
        });
        
        const blob = response.data;
        
        // Detailed logging of blob
        console.log('Blob received:', {
          size: blob.size,
          type: blob.type
        });

        if (blob && blob.size > 0) {
          const reader = new FileReader();
          
          reader.onloadstart = () => {
            setLoadingDetails('Converting to base64...');
          };
          
          reader.onloadend = () => {
            if (isMounted) {
              const base64Data = reader.result;
              console.log('Base64 conversion complete', {
                length: base64Data.length,
                prefix: base64Data.substring(0, 50) + '...'
              });
              
              setImgSrc(base64Data);
              setLoadingDetails('Image loaded successfully');
            }
          };
          
          reader.onerror = (error) => {
            console.error('FileReader error:', error);
            if (isMounted) {
              setHasError(true);
              setLoadingDetails('Error converting image');
            }
          };
          
          reader.readAsDataURL(blob);
        } else {
          console.warn('Empty blob received');
          if (isMounted) {
            setHasError(true);
            setLoadingDetails('Empty image data');
          }
        }
      
      } catch (error) {
        console.error('Error loading image:', error);
        if (isMounted) {
          setHasError(true);
          setLoadingDetails(`Load failed: ${error.message}`);
        }
      }
    };
    
    // Only attempt conversion for localhost URLs
    if (src && src.includes('localhost')) {
      setIsLoading(true);
      convertToBase64().finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
    } else {
      setImgSrc(src);
      setIsLoading(false);
    }
    
    return () => {
      isMounted = false;
    };
  }, [src]);

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        ...style,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        color: '#6c757d',
        fontSize: '12px',
        border: '1px dashed #ced4da'
      }}>
        <div>Loading...</div>
        <small>{loadingDetails}</small>
      </div>
    );
  }

  // Error or missing image state
  if (hasError || !imgSrc) {
    return (
      <div style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        color: '#6c757d',
        fontSize: '12px',
        border: '1px dashed #ced4da'
      }}>
        {fallbackText || 'Image not available'}
      </div>
    );
  }

  // Show loading indicator
  if (isLoading) {
    return (
      <div style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        color: '#6c757d',
        fontSize: '12px',
        border: '1px dashed #ced4da'
      }}>
        Loading...
      </div>
    );
  }

  // Show fallback for error or missing image
  if (hasError || !imgSrc) {
    return (
      <div style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        color: '#6c757d',
        fontSize: '12px',
        border: '1px dashed #ced4da'
      }}>
        {fallbackText || 'Image not available'}
      </div>
    );
  }

  // Show the image
  return (
    <img
      src={imgSrc}
      alt={alt}
      style={style}
      onError={() => {
        console.error(`Failed to load image: ${src}`);
        setHasError(true);
      }}
    />
  );
};

export const Certificate = React.forwardRef(({ Image, value = {} }, ref) => {
  // alert(JSON.stringify(value))
  const { application_date, applicant_name, shop_number, former_allottee, application_id, passport_photo } = value;
  const [profileImage, setProfileImage] = useState(null);
  
  // Create a direct URL to the image
  const profileImageUrl = passport_photo ? `http://localhost:3000/uploads/${passport_photo}` : null;
  
  // Pre-fetch and convert profile image to base64 when certificate loads
  useEffect(() => {
    const loadProfileImage = async () => {
      if (profileImageUrl) {
        try {
            // alert("reader")
          const response = await axios.get(profileImageUrl, { 
            responseType: 'blob',
            timeout: 3000
          });
          
          const blob = response.data;
          
          const reader = new FileReader();
         
          reader.onloadend = () => setProfileImage(reader.result);
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Error loading profile image:', error);
          setProfileImage(null);
        }
      }
    };
    
    loadProfileImage();
  }, [profileImageUrl]);
  
  const qrDetails = `${applicant_name || ''} | ${shop_number || ''} | ${application_date || ''}`;
  
  return (
    <div style={styles.body}>
      {/* {JSON.stringify(value)} */}
      <div style={styles.container} ref={ref}>
        <h2 style={styles.header}>KANO STATE GOVERNMENT</h2>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
          <ImageWithFallback
            src={logoImage}
            alt="Logo"
            style={styles.logo}
            fallbackText="Logo Image"
          />
          <div style={styles.id}>UID: {application_id}</div>
        </div>
        <h3 style={styles.subheader}>Change of Allottee Name Certificate</h3>
        <h3 style={styles.subsubheader}>
          Muhammad Abubakar Rimi,Singa and Galadima Market Board, Kano
          Kano State
        </h3>
        <h3 style={{ ...styles.subsubheader, marginTop: -10 }}>Kano state</h3>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "20px"
        }}>
          <QRCode size={120} value={qrDetails} level="H" />
          
          {Image && (
            <ImageWithFallback
              src={Image}
              alt="Document Image"
              style={{ 
                ...styles.qrCode, 
                width: 120,
                height: 120,
                borderRadius: '8px'
              }}
              fallbackText="Document Image"
            />
          )}
          
          {/* Profile Image Section with base64 support */}
          <div style={{ 
            border: '1px solid #ddd', 
            padding: '5px', 
            maxWidth: '150px',
            height: '120px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }} className="profile-image-container">
            <ImageWithFallback
              src={profileImage || profileImageUrl}
              alt="Profile"
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100px',
                objectFit: 'contain'
              }}
              fallbackText="Profile Photo"
            />
            
            {/* Verification Badge Overlay */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80px',  
              height: '80px',
              opacity: 0.8,   
              zIndex: 100,    
              pointerEvents: 'none'  
            }}>
              {/* <ImageWithFallback
                src={verify}
                alt="Verified"
                style={{
                  width: '100%', 
                  height: '100%',
                  objectFit: 'contain'
                }}
                fallbackText=""
              /> */}
            </div>
          </div>
        </div>
        <p style={styles.text}>
          <strong>THIS IS TO CERTIFY THAT</strong>
        </p>
        <div
          style={{
            marginTop: 30,
            width: "40%",
            marginLeft: 200,
            marginBottom: 30,
            fontSize: "20px",
            fontWeight: "bold",
            color: "#000",
            fontFamily: "stencil-style, bold, serif font ",
          }}
        >
          {applicant_name ? applicant_name.toUpperCase() : ''}
        </div>
        <div style={{ textAlign: "justify" }}>
          <h4 style={{ fontSize: "20px", textTransform: "uppercase" }}>
            He/She is now the original allottee of :<span style={{borderBottom: "5px dotted black", fontWeight: "bold"}}> {shop_number || ''} </span>
          </h4>
          <h4 style={{ fontSize: "20px", textTransform: "uppercase" }}>
            Transfer of Allocation from :<span style={{borderBottom: "5px dotted black", fontWeight: "bold"}}> {former_allottee || ''} </span>
          </h4>
          <h4 style={{ fontSize: "20px" }}>
            Date: <span style={{borderBottom: "5px dotted black", fontWeight: "bold"}}> {application_date ? moment(application_date).format('LL') : ''} </span>
          </h4>
        </div>
        <div style={styles.signatureContainer}>
        <div className='bg-white'>
            <ImageWithFallback
              src={signature}
              style={{width: 170, height: 70}}
              alt="Signature"
              fallbackText="Signature"
            />
          </div>
          <h4>Managing Director</h4>

          <div
            style={{
              width: "150%",
              marginLeft: -30,
              marginBottom: 30,
            }}
          >
            <ImageWithFallback
              src={verify}
              style={{width: 150, height: 150}}
              alt="Verification"
              fallbackText=""
            />
          </div>
        </div>
      </div>
    </div>
  );
});

const styles = {
  // Styles remain the same
  body: {
    textAlign: "center",
    backgroundImage: `url(${waterMarkImage})`,
    backgroundColor: "white",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "794px",
    height: "1123px",
    padding: "20px",
    margin: "auto",
    backgroundPosition: "center",
    backgroundOpacity: 0.5
  },
  container: {
    position: "relative",
    width: "100%",
    maxWidth: "800px",
    margin: "auto",
    padding: "40px",
  },
  id: {
    fontWeight: "bold",
    marginTop: 50,
    width: "60%",
    marginLeft: -100
  },
  header: {
    fontSize: "33px",
    fontWeight: "bold",
    fontFamily: "'Comfortaa', sans-serif",
    color: "#006080",
    marginTop: -30,
  },
  subheader: {
    fontSize: "40px",
    fontWeight: "bold",
    color: "#663300",
    fontFamily: "'Roboto', cursive",
    fontWeight: 400,
    fontStyle: "normal",
  },
  subsubheader: {
    fontSize: "16px",
    fontWeight: "900",
    color: "#000",
  },
  text: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#000",
    fontFamily: "stencil-style, bold, serif font",
    marginTop: 40,
    fontFamily: "Krona One",
    fontWeight: 400,
    fontStyle: "normal"   
  },
  logo: {
    width: "500px",
    height: "auto",
    marginTop: -135,
    marginBottom: -180,
    marginLeft: 100
  },
  qrCode: {
    width: "160px",
    height: "160px",
  },
  signatureContainer: {
    display: "flex",
    flexDirection: "column",
    float: "right",
    marginTop: "100px",
    paddingRight: "50px"
  },
  signature: {
    width: "200px",
    height: "auto",
  },
  stamp: {
    width: "100px",
    height: "auto",
    marginLeft: "50px",
  },
};

export default Certificate;