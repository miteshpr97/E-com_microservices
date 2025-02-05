import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={footerStyle}>
            <div style={containerStyle}>
                <div style={sectionStyle}>
                    <h4>About Us</h4>
                    <p>Learn more about our company and values.</p>
                </div>
                <div style={sectionStyle}>
                    <h4>Customer Service</h4>
                    <p>Contact us for any questions or concerns.</p>
                </div>
                <div style={sectionStyle}>
                    <h4>Follow Us</h4>
                    <p>Stay connected through our social media channels.</p>
                </div>
            </div>
            <div style={bottomStyle}>
                <p>&copy; {new Date().getFullYear()} ShopeMate. All rights reserved.</p>
            </div>
        </footer>
    );
};

const footerStyle: React.CSSProperties = {
    backgroundColor: '#1f2937',
    color: '#fff',
    padding: '20px 0',
    textAlign: 'center',
    width: "100%"
};

const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-around',
    maxWidth: '1200px',
    margin: '0 auto',
};

const sectionStyle: React.CSSProperties = {
    flex: 1,
    padding: '0 20px',
};

const bottomStyle: React.CSSProperties = {
    borderTop: '1px solid #444',
    paddingTop: '10px',
    marginTop: '20px',
};

export default Footer;