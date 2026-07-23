import "./WhatsApp.css";
import { FaWhatsapp } from "react-icons/fa";

function WhatsApp() {

    const phoneNumber = "8445150766"; // Replace with your WhatsApp number

    const message = encodeURIComponent(`Hi Neeraj 👋

I came across your portfolio website and I'm impressed with your work.

I have a project requirement and would like to discuss it with you.

Please let me know when you're available.

Looking forward to working with you.

Thanks! 🚀`);


    return (
        <a
            href={`https://wa.me/${phoneNumber}?text=${message}`}
            className="whatsapp"
            target="_blank"
            rel="noopener noreferrer"
        >
            <FaWhatsapp />
        </a>
    );
}

export default WhatsApp;