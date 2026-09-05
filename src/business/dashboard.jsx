import React, { useState, useEffect } from "react";
import { useAuth } from "@/auth/auth";
import { getAllScales, requestReverification } from "@/data/mockdata";

import MerchantHeader from "./components/MerchantHeader";
import StatCards from "./components/statcards";
import ScaleTable from "./components/scaletable";
import AddScaleModal from "./components/addscaletable";
import QRStickerModal from "./components/qrsticker";
import ReinspectionModal from "./components/reinspectionmodal";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [scales, setScales] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedQRScale, setSelectedQRScale] = useState(null);
  const [selectedReinspectionScale, setSelectedReinspectionScale] = useState(null);

  const loadScales = () => {
    const all = getAllScales();
    if (currentUser?.businessName) {
      const myScales = all.filter(
        (s) => s.businessName.toLowerCase() === currentUser.businessName.toLowerCase()
      );
      setScales(myScales);
    } else {
      setScales(all);
    }
  };

  useEffect(() => {
    loadScales();
  }, [currentUser]);

  const handleReverifyClick = (scale) => {
    setSelectedReinspectionScale(scale);
  };

  const handleReinspectionSubmit = (requestedInspectionDate) => {
    requestReverification(selectedReinspectionScale.id, requestedInspectionDate);
    setSelectedReinspectionScale(null);
    loadScales();
    alert("Re-inspection application sent to the District Admin queue.");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4 font-sans">
      <MerchantHeader 
        currentUser={currentUser} 
        onOpenAddModal={() => setIsAddModalOpen(true)} 
      />

      <StatCards scales={scales} />

      <ScaleTable 
        scales={scales} 
        onSelectQR={(scale) => setSelectedQRScale(scale)}
        onReverify={handleReverifyClick}
      />

      <AddScaleModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onScaleCreated={loadScales} 
        currentUser={currentUser} 
      />

      <QRStickerModal 
        scale={selectedQRScale} 
        onClose={() => setSelectedQRScale(null)} 
      />

      <ReinspectionModal
        scale={selectedReinspectionScale}
        onClose={() => setSelectedReinspectionScale(null)}
        onSubmit={handleReinspectionSubmit}
      />
    </div>
  );
}