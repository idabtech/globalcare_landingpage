import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { C, SPECIALTIES } from '../constants/data';
import Btn from '../ui/Btn';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import SectionTitle from '../ui/SectionTitle';
import { useNavigate } from 'react-router-dom';
import { treatmentPackageService } from '../service/treatmentPackage.service';
import { hospitalService } from '../service/hospital.service';

const PackagesPage = () => {
    const { setSelectedHospital, setHospitalTab } = useContext(AppContext);
    const nav = useNavigate();

    const [packages, setPackages] = useState([]);
    const [hospitalsList, setHospitalsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pkgFilter, setPkgFilter] = useState("All");

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Fetch packages
                const pkgsRes = await treatmentPackageService.getTreatmentPackages();
                const pkgs = pkgsRes?.data?.packages || pkgsRes?.packages || [];
                setPackages(pkgs);

                // Fetch hospitals for details redirect
                const hospRes = await hospitalService.getHospitals();
                const hosps = hospRes?.hospitals || [];
                setHospitalsList(hosps);
            } catch (err) {
                console.error("Failed to load packages page data:", err);
                setError("Failed to load treatment packages. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const getCountryFlagEmoji = (countryName) => {
        if (!countryName) return "🌐";
        const name = countryName.toLowerCase().trim();
        if (name === "thailand") return "🇹🇭";
        if (name === "india") return "🇮🇳";
        if (name === "turkey" || name === "turkiye") return "🇹🇷";
        if (name === "malaysia") return "🇲🇾";
        if (name === "singapore") return "🇸🇬";
        return "🌐";
    };

    const formatPrice = (price, currency) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD',
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleViewHospital = (pkg) => {
        let hospitalObj = hospitalsList.find(h => h.id === pkg.hospital_id || h.name === pkg.hospital_name);
        if (!hospitalObj) {
            hospitalObj = {
                id: pkg.hospital_id,
                name: pkg.hospital_name,
                city: pkg.hospital_city,
                country: pkg.hospital_country,
                rating: pkg.hospital_rating,
                logo: pkg.hospital_logo,
                accreditation: "JCI",
                savings: pkg.save_percentage ? `Save ${pkg.save_percentage}%` : "Best Price",
                created_at: new Date(),
                total_beds: "N/A",
                doctors: []
            };
        }
        setSelectedHospital(hospitalObj);
        setHospitalTab("overview");
        nav("/details");
    };

    const filtered = pkgFilter === "All"
        ? packages
        : packages.filter(p => p.specialty === pkgFilter);

    const categories = ["All", ...new Set(packages.map(p => p.specialty).filter(Boolean))];

    if (loading) {
        return (
            <div style={{ paddingTop: 80, padding: "80px 48px", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ color: C.slateL, fontSize: 16 }}>Loading Treatment Packages...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ paddingTop: 80, padding: "80px 48px", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ color: C.red, fontSize: 16, marginBottom: 16 }}>{error}</div>
                <Btn onClick={() => window.location.reload()}>Retry</Btn>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: 80, padding: "80px 48px", minHeight: "100vh" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <SectionTitle title="Treatment Packages" sub="All-inclusive healthcare bundles for a smooth medical journey" />

                <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
                    {categories.map(c => {
                        return (
                            <button key={c} onClick={() => setPkgFilter(c)} style={{
                                padding: "8px 18px", borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: "pointer",
                                background: pkgFilter === c ? `linear-gradient(135deg,${C.teal},${C.tealL})` : C.card,
                                color: pkgFilter === c ? C.white : C.slateL,
                                border: `1px solid ${pkgFilter === c ? "transparent" : C.border}`,
                                transition: "all 0.2s"
                            }}>{c}</button>
                        )
                    })}
                </div>

                {filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: C.slateL, fontSize: 16 }}>
                        No treatment packages found.
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 }}>
                        {filtered.map(p => (
                            <Card key={p.id}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontSize: 24 }}>{getCountryFlagEmoji(p.hospital_country)}</span>
                                        <Badge color={C.gold}>{p.specialty}</Badge>
                                    </div>
                                    <div style={{ color: C.tealL, fontWeight: 900, fontSize: 22 }}>
                                        {formatPrice(p.price, p.currency)}
                                    </div>
                                </div>
                                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 12 }}>{p.title}</h3>
                                <p style={{ color: C.slateL, fontSize: 13, marginBottom: 16 }}>at {p.hospital_name}</p>
                                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                                    <div style={{ fontSize: 11, fontWeight: 800, color: C.slateL, marginBottom: 10, textTransform: "uppercase" }}>Includes:</div>
                                    {p.includes && p.includes.map(inc => (
                                        <div key={inc} style={{ fontSize: 13, color: C.slateL, marginBottom: 6, display: "flex", gap: 8 }}>
                                            <span style={{ color: C.tealL }}>✓</span> {inc}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                    <div style={{ fontSize: 13, color: C.slateL }}>⏱ Duration: <span style={{ color: C.black, fontWeight: 700 }}>{p.duration || 'Flexible'}</span></div>
                                    {p.save_percentage > 0 && (
                                        <div style={{ background: "rgba(34,201,122,0.12)", color: C.green, padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 800 }}>
                                            Save {p.save_percentage}%
                                        </div>
                                    )}
                                </div>
                                <Btn style={{ width: "100%", padding: 12 }} onClick={() => handleViewHospital(p)}>
                                    View Full Package & Hospital
                                </Btn>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PackagesPage;

