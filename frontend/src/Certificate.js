import React from 'react';
import "@fontsource/comfortaa/700.css";
import logoImage from "./image/logo2.png";
import waterMarkImage from "./image/watermark2.jpg";
// import qrCodeImage from "./image/qrcode.jpg";
import { QRCode } from 'react-qr-code'

const Certificate = React.forwardRef(({ Image, value = {} }, ref) => {
    console.log(Image, "image", value)
    const { date, name, shop_no, allocation } = value
    const qrDetails = `${name} | ${shop_no} | ${date}`
    return (
        <div ref={ref} style={styles.body}>
            <div style={styles.container}>
                <h2 style={styles.header}>KANO STATE GOVERNMENT</h2>
                <img src={logoImage} alt="Logo" style={styles.logo} />
                <h3 style={styles.subheader}>Change of Allottee Name Certificate</h3>
                <h3 style={styles.subsubheader}>
                    Muhammad Abubakar Rimi sabon gari market company limited
                </h3>
                <h3 style={{ ...styles.subsubheader, marginTop: -10 }}>Kano state</h3>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <QRCode size={120} value={qrDetails} level="H" />
                    {Image && (
                        <img src={Image} alt="QR Code" style={styles.qrCode} onError={(e) => {
                            e.target.style.display = 'none';
                            console.error('Failed to load document image')
                        }} />
                    )}
                </div>
                <p style={styles.text}>
                    <strong>THIS IS TO CERTIFY THAT</strong>
                </p>
                <div
                    style={{
                        border: "1px solid black",
                        marginTop: 30,
                        width: "40%",
                        marginLeft: 200,
                        marginBottom: 30,
                    }}
                >
                    {name}
                </div>
                <div style={{ textAlign: "justify" }}>
                    <h4 style={{ fontSize: "26px", textTransform: "uppercase" }}>
                        He/She is now the original allottee of .....................
                    </h4>
                    <h4 style={{ fontSize: "26px", textTransform: "uppercase" }}>
                        Transfer of Allocation from:
                        ........................................
                    </h4>
                    <h4 style={{ fontSize: "26px" }}>
                        Date: {date}
                        {/* ........................................................................................... */}
                    </h4>
                </div>
                <div style={styles.signatureContainer}>
                    <h4>Managing Director</h4>
                    <div
                        style={{
                            border: "1px solid black",
                            marginTop: 30,
                            width: "150%",
                            marginLeft: -30,
                            marginBottom: 30,
                        }}
                    ></div>
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
        fontFamily: "'Roboto",
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
    },
    logo: {
        width: "500px",
        height: "auto",
        marginTop: -135,
        marginBottom: -180,
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