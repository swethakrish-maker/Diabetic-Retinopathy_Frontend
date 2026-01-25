import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./Hamburger.css";

const HamburgerMenu = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const toggleMenu = () => setIsOpen(prev => !prev);

    useEffect(() => {
        if (!isOpen || !user) return;

        const fetchPredictions = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from("predictions")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (!error) setPredictions(data || []);
            setLoading(false);
        };

        fetchPredictions();
    }, [isOpen, user]);

const getImageName = (url) => {
  if (!url) return "Unknown";
  const filename = url.split("/").pop();
  return filename.includes("-")
    ? filename.split("-").slice(1).join("-")
    : filename;
};


    return (
        <>
            {/*Hamburger */}
            <div className="hamburger" onClick={toggleMenu}>
                <span />
                <span />
                <span />
            </div>

            {/* Full Screen Menu */}
            <div className={`side-menu ${isOpen ? "open" : ""}`}>
                <div className="menu-header">
                    <h3>Prediction History</h3>
                    <button className="close-btn" onClick={toggleMenu}>×</button>
                </div>

                <div className="menu-content">
                    {loading ? (
                        <p>Loading predictions...</p>
                    ) : predictions.length === 0 ? (
                        <p>No predictions yet. Upload your first retina scan!</p>
                    ) : (
                        <div className="predictions-grid">
                            {predictions.map(p => (
                                <div key={p.id} className="card">
                                    <p><b>Diagnosis:</b> {p.predicted_class}</p>
                                    <p><b>Date:</b> {new Date(p.created_at).toLocaleString()}</p>
                                    <p><b>Image:</b> {getImageName(p.image_url)}</p>

                                    {p.image_url && (
                                        <img
                                            src={p.image_url}
                                            alt="Retina scan"
                                            onClick={() => setSelectedImage(p.image_url)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div className="image-modal" onClick={() => setSelectedImage(null)}>
                    <img src={selectedImage} alt="full" />
                </div>
            )}
        </>
    );
};

export default HamburgerMenu;
