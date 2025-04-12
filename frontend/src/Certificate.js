import React from 'react';
import "@fontsource/comfortaa/700.css";
import logoImage from "./image/logo2.png";
import waterMarkImage from "./image/watermark2.jpg";
// import qrCodeImage from "./image/qrcode.jpg";
import verify from "./verified-removebg-preview.png"
import signature from "./signature.png"
import { QRCode } from 'react-qr-code'
import moment from 'moment'
 export const Certificate = React.forwardRef(({ Image, value = {} }, ref) => {
    const { date, name, shop_no, allocation, Id,image_url } = value
    console.log(Image, "image", value, "id", Id)
    const qrDetails = `${name} | ${shop_no} | ${date}`


    
    return (
        <div  style={styles.body}>
            <div style={styles.container}>
                {/* {JSON.stringify(value)} */}
                <h2 style={styles.header}>KANO STATE GOVERNMENT</h2>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                    <img src={logoImage} alt="Logo" style={styles.logo} />
                    <div style={styles.id}>UID: MBG-2-2</div>
                </div>
                <h3 style={styles.subheader}>Change of Allottee Name Certificate</h3>
                <h3 style={styles.subsubheader}>
                    Muhammad Abubakar Rimi sabon gari market company limited
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
                        <img 
                            src={Image} 
                            alt="QR Code" 
                            style={{ 
                                ...styles.qrCode, 
                                width: 120,
                                height: 120,
                                borderRadius: '8px'
                            }} 
                            onError={(e) => {
                                e.target.style.display = 'none';
                                console.error('Failed to load document image')
                            }} 
                        />
                    )}
 {image_url && (
  <div style={{ 
    border: '1px solid #ddd', 
    padding: '5px', 
    maxWidth: '150px',
    height: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative'  // Keep position relative
  }}>
    {/* Main document image */}
    <img 
      src={`http://localhost:3000/uploads/${image_url}`} 
      alt="Document"
      style={{ 
        maxWidth: '100%', 
        maxHeight: '100px',
        objectFit: 'contain'
      }}
      onError={(e) => e.target.style.display = 'none'}
    />
    
    {/* Verification Badge Overlay - FIXED */}
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
      <img
        src={verify}
        alt="Verified"
        style={{
          width: '100%', 
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
    
    <div style={{ 
      fontSize: '10px', 
      textAlign: 'center', 
      marginTop: '5px',
      color: '#666'
    }}>
      {/* ATTACHED DOCUMENT */}
    </div>
  </div>
)}
               </div>
                <p style={styles.text}>
                    <strong>THIS IS TO CERTIFIED THAT</strong>
                </p>
                <div
                    style={{
                        // border: "1px solid black",
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
                    {name.toUpperCase()}
                    {/* {JSON.stringify(value)} */}
                </div>
                <div style={{ textAlign: "justify" }}>
                    <h4 style={{ fontSize: "20px", textTransform: "uppercase" }}>
                        He/She is now the original allottee of :<span style={{borderBottom: "5px dotted black", fontWeight: "bold"}}> {value?.shop_no} </span>
                    </h4>
                    <h4 style={{ fontSize: "20px", textTransform: "uppercase",  }}>
                        Transfer of Allocation from :<span style={{borderBottom: "5px dotted black", fontWeight: "bold"}}> {value?.allocation} </span>
                    </h4>
                    <h4 style={{ fontSize: "20px" }}>
                        Date: <span style={{borderBottom: "5px dotted black", fontWeight: "bold"}}> {moment(date).format('LL')} </span>
                    </h4>
                </div>
                <div style={styles.signatureContainer}>
                    <h4>Managing Director</h4>

                    
                    <div className='bg-white'>
                    <img src={signature} style={{width: 170, height: 70}} />
                    </div>

                    
                    <div
                        style={{
                            // border: "1px solid black",
                            // marginTop: 30,
                            width: "150%",
                            marginLeft: -30,
                            marginBottom: 30,
                        }}
                    >
                         <img src={verify} style={{width: 150, height: 150}} />
                    </div>
                </div>
            </div>
        </div>
    );
})

const styles = {
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
        fontFamily: "stencil-style, bold, serif font ",
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

export default Certificate