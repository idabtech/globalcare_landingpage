import React from 'react';
import { C, HOSPITALS } from '../constants/data';
import Btn from '../ui/Btn';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { hospitalService } from '../service/hospital.service';

const HospitalDetails = () => {
    const { selectedHospital, showNotif, hospitalTab, setHospitalTab } = React.useContext(AppContext);
    const h = selectedHospital || HOSPITALS[0];
    const nav = useNavigate();

    const activeTab = ["overview", "doctors", "specialties"].includes(hospitalTab) ? hospitalTab : "overview";

    // Booking states
    const [selectedSpec, setSelectedSpec] = React.useState(null);
    const [bookingDoc, setBookingDoc] = React.useState(null);
    const [isDirectBooking, setIsDirectBooking] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [selectedTime, setSelectedTime] = React.useState(null);
    const [formName, setFormName] = React.useState("");
    const [formEmail, setFormEmail] = React.useState("");
    const [formPhone, setFormPhone] = React.useState("");
    const [formNotes, setFormNotes] = React.useState("");
    const [formType, setFormType] = React.useState();
    const [formPlatform, setFormPlatform] = React.useState("zoom");
    const [bookingLoading, setBookingLoading] = React.useState(false);
    const [bookingSuccess, setBookingSuccess] = React.useState(null);
    const [duration, setDuration] = React.useState(15);
    const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
    const [busySlots, setBusySlots] = React.useState([]);
    const [loadingBusy, setLoadingBusy] = React.useState(false);

    // Helpers for parsing doctor availability days and times
    const parseAvailableDays = (days) => {
        if (!days) return ["Mon", "Tue", "Wed", "Thu", "Fri"];
        if (Array.isArray(days)) return days;
        try {
            const parsed = JSON.parse(days);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {
            if (typeof days === "string") {
                return days.split(",").map(d => d.trim());
            }
        }
        return [];
    };

    const parseTime = (timeStr) => {
        if (!timeStr) return null;
        const parts = timeStr.split(":");
        if (parts.length >= 2) {
            return {
                hours: parseInt(parts[0], 10),
                minutes: parseInt(parts[1], 10)
            };
        }
        return null;
    };

    const getNextAvailableDates = (doc) => {
        if (!doc) return [];
        const allowedDays = parseAvailableDays(doc.available_days);
        const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dates = [];
        const today = new Date();

        // Look up to 30 days ahead to find matching available days
        for (let i = 1; i <= 30; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const dayName = dayMap[d.getDay()];
            if (allowedDays.includes(dayName)) {
                dates.push(d);
            }
            if (dates.length >= 7) break;
        }
        return dates;
    };

    const generateTimeSlots = (doc) => {
        if (!doc) return [];
        const from = parseTime(doc.available_from) || { hours: 9, minutes: 0 };
        const to = parseTime(doc.available_to) || { hours: 17, minutes: 0 };

        const slots = [];
        let currentHour = from.hours;
        let currentMin = from.minutes;

        const targetHour = to.hours;
        const targetMin = to.minutes;

        while (currentHour < targetHour || (currentHour === targetHour && currentMin < targetMin)) {
            const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
            slots.push(timeString);
            currentHour += 1;
        }
        return slots;
    };

    const generateCalendarDays = (year, month) => {
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        for (let day = 1; day <= totalDays; day++) {
            days.push(new Date(year, month, day));
        }
        return days;
    };

    const handleBookSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDate) {
            showNotif("Please select a date", "error");
            return;
        }
        if (!selectedTime) {
            showNotif("Please select a time slot", "error");
            return;
        }
        setBookingLoading(true);
        try {
            const payload = {
                doctor_id: bookingDoc.id,
                hospital_id: h.id,
                appt_date: selectedDate.toISOString().split("T")[0],
                appt_time: selectedTime,
                type: selectedSpec,
                platform: formPlatform,
                patient_name: formName,
                patient_email: formEmail,
                patient_phone: formPhone,
                notes: formNotes,
                duration: duration,
            };
            await hospitalService.bookAppointment(payload);
            setBookingSuccess({
                doctorName: bookingDoc.name,
                date: selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
                time: selectedTime,
                email: formEmail
            });
            showNotif("Appointment booked successfully!", "success");
        } catch (err) {
            console.error("Booking error:", err);
            const errMsg = err.response?.data?.error || "Failed to book appointment. Please try again.";
            showNotif(errMsg, "error");
        } finally {
            setBookingLoading(false);
        }
    };

    const handleCloseModal = () => {
        setBookingDoc(null);
        setIsDirectBooking(false);
        setSelectedDate(null);
        setSelectedTime(null);
        setBusySlots([]);
        setFormName("");
        setFormEmail("");
        setFormPhone("");
        setFormNotes("");
        setFormType("Telemedicine");
        setFormPlatform("zoom");
        setBookingSuccess(null);
    };

    React.useEffect(() => {
        if (bookingDoc && selectedDate) {
            const fetchBusySlots = async () => {
                setLoadingBusy(true);
                try {
                    const year = selectedDate.getFullYear();
                    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                    const day = String(selectedDate.getDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}`;

                    const res = await hospitalService.getBusySlots(bookingDoc.id, dateStr);
                    setBusySlots(res.busySlots || []);
                } catch (err) {
                    console.error("Error fetching busy slots:", err);
                    setBusySlots([]);
                } finally {
                    setLoadingBusy(false);
                }
            };
            fetchBusySlots();
        } else {
            setBusySlots([]);
        }
    }, [selectedDate, bookingDoc]);

    const todayDate = new Date();
    const isPrevDisabled = currentYear < todayDate.getFullYear() || (currentYear === todayDate.getFullYear() && currentMonth <= todayDate.getMonth());

    const handlePrevMonth = () => {
        if (isPrevDisabled) return;
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    React.useEffect(() => {
        if (bookingDoc) {
            setSelectedSpec(bookingDoc.specialization);
        }
    }, [bookingDoc]);

    return (
        <div style={{ paddingTop: 10, minHeight: "100vh" }}>
            <div style={{ padding: "40px 48px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <button onClick={() => nav("/search")} style={{ background: "none", border: "none", color: C.slateL, cursor: "pointer", marginBottom: 20 }}>← Back to Search</button>
                    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                        <div style={{ width: 80, height: 80, background: "rgba(11,181,160,0.15)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🏥</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}><Badge color={C.gold}>{h?.accreditation} Certified</Badge><Badge color={C.green}>Save {h?.savings}</Badge></div>
                            <h1 style={{ fontSize: 28, fontWeight: 800 }}>{h?.name}</h1>
                            <p style={{ color: C.slateL }}>{h?.city}, {h?.country}</p>
                        </div>
                        <Btn onClick={() => window.open(import.meta.env.VITE_ADMIN_URL, "_blank")} style={{ padding: "12px 24px" }}>Request Quote</Btn>
                    </div>
                    <div style={{ display: "flex", gap: 4, marginTop: 32 }}>
                        {["overview", "doctors", "specialties"].map(t => {
                            return (
                                <button key={t} onClick={() => setHospitalTab(t)} style={{ padding: "10px 20px", borderRadius: "8px 8px 0 0", cursor: "pointer", background: activeTab === t ? '#6e6f701c' : "transparent", color: activeTab === t ? C.tealL : C.slateL, border: activeTab === t ? `1px solid ${C.border}` : "none", borderBottom: "none", textTransform: "capitalize" }}>{t}</button>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div style={{ padding: "32px 48px", maxWidth: 1100, margin: "0 auto" }}>
                {activeTab === "overview" && (
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
                        <div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>About the Institution</h3>
                            <p style={{ color: C.slateL, lineHeight: 1.8, marginBottom: 24 }}>{h?.name} is a global leader in healthcare excellence, serving over {h?.intlPct} international patients. With a success rate of {h?.outcomes}%, the hospital combines cutting-edge technology with compassionate care.</p>
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Key Facilities</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                {["International Patient Hub", "24/7 Translation", "Telehealth Support", "Luxury Wellness Suites"].map(f => <div key={f} style={{ color: C.slateL, fontSize: 14 }}>✓ {f}</div>)}
                            </div>
                        </div>
                        <Card>
                            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
                                Hospital Facts
                            </h3>

                            {[
                                ["Founded", h?.created_at ? new Date(h?.created_at).getFullYear() : "-"],
                                ["Beds", h?.total_beds],
                                ["Doctors", h?.doctors?.length || h?.doctor_count || 0]
                            ].map(([k, v]) => (
                                <div
                                    key={k}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "8px 0",
                                        borderBottom: `1px solid ${C.border}`,
                                        fontSize: 13
                                    }}
                                >
                                    <span style={{ color: C.slateL }}>{k}</span>
                                    <span style={{ fontWeight: 600 }}>{v}</span>
                                </div>
                            ))}

                            <Btn
                                style={{ width: "100%", marginTop: 20 }}
                                onClick={() => {
                                    if (h?.doctors && h.doctors.length > 0) {
                                        setIsDirectBooking(true);
                                        setBookingDoc(h.doctors[0]);
                                    } else {
                                        showNotif("No doctors available for this hospital.", "error");
                                    }
                                }}
                            >
                                Book Consultation
                            </Btn>
                        </Card>
                    </div>
                )}
                {activeTab === "doctors" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                        {h?.doctors && h.doctors.length > 0 ? (
                            h.doctors.map(d => (
                                <Card key={d.id} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                                    <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
                                        {d.photo_url ? (
                                            <img src={d.photo_url} alt={d.name} style={{ width: 64, height: 64, borderRadius: 32, objectFit: "cover" }} />
                                        ) : (
                                            <div style={{ fontSize: 40, width: 64, height: 64, background: "rgba(255,255,255,0.03)", borderRadius: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>👨‍⚕️</div>
                                        )}
                                        <div>
                                            <h3 style={{ fontSize: 16, fontWeight: 800 }}>{d.name}</h3>
                                            <p style={{ color: C.tealL, fontSize: 13, fontWeight: 600 }}>{d.specialization}</p>
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, fontSize: 13, color: C.slateL, display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <span>Experience:</span>
                                            <span style={{ color: C.black, fontWeight: 600 }}>{Math.abs(d.experience_yrs)} years</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <span>Consultation Fee:</span>
                                            <span style={{ color: C.black, fontWeight: 600 }}>${d.consultation_fee}</span>
                                        </div>
                                        {d.rating > 0 && (
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <span>Rating:</span>
                                                <span style={{ color: C.goldL, fontWeight: 600 }}>⭐ {d.rating} ({d.total_reviews})</span>
                                            </div>
                                        )}
                                    </div>
                                    <Btn onClick={() => setBookingDoc(d)} style={{ width: "100%", padding: "10px" }}>Book Appointment</Btn>
                                </Card>
                            ))
                        ) : (
                            <div style={{ color: C.slateL, gridColumn: "1/-1" }}>No doctors listed for this hospital.</div>
                        )}
                    </div>
                )}
                {activeTab === "specialties" && (
                    selectedSpec ? (
                        /* specialty doctors listing view */
                        <div>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                                <button onClick={() => setSelectedSpec(null)} style={{ background: "none", border: "none", color: C.tealL, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", gap: 6, fontWeight: 600, padding: 0 }}>
                                    <span>←</span> Back
                                </button>
                                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Available Specialists in {selectedSpec}</h2>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                                {(() => {
                                    const filteredDoctors = (h.doctors || []).filter(d => d.specialization === selectedSpec);
                                    if (filteredDoctors.length > 0) {
                                        return filteredDoctors.map(d => (
                                            <Card key={d.id} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                                                <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
                                                    {d.photo_url ? (
                                                        <img src={d.photo_url} alt={d.name} style={{ width: 64, height: 64, borderRadius: 32, objectFit: "cover" }} />
                                                    ) : (
                                                        <div style={{ fontSize: 40, width: 64, height: 64, background: "rgba(255,255,255,0.03)", borderRadius: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>👨‍⚕️</div>
                                                    )}
                                                    <div>
                                                        <h3 style={{ fontSize: 16, fontWeight: 800 }}>{d.name}</h3>
                                                        <p style={{ color: C.tealL, fontSize: 13, fontWeight: 600 }}>{d.specialization}</p>
                                                    </div>
                                                </div>
                                                <div style={{ flex: 1, fontSize: 13, color: C.slateL, display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <span>Experience:</span>
                                                        <span style={{ color: C.black, fontWeight: 600 }}>{Math.abs(d.experience_yrs)} years</span>
                                                    </div>
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <span>Consultation Fee:</span>
                                                        <span style={{ color: C.black, fontWeight: 600 }}>${d.consultation_fee}</span>
                                                    </div>
                                                    {d.rating > 0 && (
                                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                            <span>Rating:</span>
                                                            <span style={{ color: C.goldL, fontWeight: 600 }}>⭐ {d.rating} ({d.total_reviews})</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <Btn onClick={() => setBookingDoc(d)} style={{ width: "100%", padding: "10px" }}>Book Appointment</Btn>
                                            </Card>
                                        ));
                                    } else {
                                        return <div style={{ color: C.slateL, gridColumn: "1/-1" }}>No doctors listed for this specialty at this hospital.</div>;
                                    }
                                })()}
                            </div>
                        </div>
                    ) : (
                        /* specialty listing view */
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                            {h.specialties && Array.isArray(h.specialties) && h.specialties.length > 0 ? (
                                h.specialties.map((s, idx) => (
                                    <Card key={idx} onClick={() => setSelectedSpec(s)} style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = C.tealL} onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                                        <div style={{ width: 48, height: 48, background: "rgba(11,181,160,0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: C.tealL }}>⚕️</div>
                                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>{s}</h3>
                                    </Card>
                                ))
                            ) : (
                                <div style={{ color: C.slateL, gridColumn: "1/-1" }}>No specialties listed for this hospital.</div>
                            )}
                        </div>
                    )
                )}
            </div>

            {/* ─── BOOKING MODAL ─── */}
            {bookingDoc && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    // backgroundColor: "rgba(5, 14, 28, 0.85)",
                    backdropFilter: "blur(12px)",
                    zIndex: 1000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflowY: "auto",
                    padding: 20
                }}>
                    <div style={{
                        width: "100%",
                        maxWidth: 620,
                        backgroundColor: C.white,
                        border: `1px solid ${C.border}`,
                        borderRadius: 20,
                        padding: 32,
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
                        position: "relative",
                        color: C.black,
                        height: 600,
                        overflow: "auto"
                    }}>
                        {/* Close button */}
                        <button onClick={handleCloseModal} style={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            background: "rgba(255,255,255,0.05)",
                            border: "none",
                            borderRadius: "50%",
                            width: 32,
                            height: 32,
                            color: C.black,
                            fontSize: 16,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>✕</button>

                        {bookingSuccess ? (
                            /* Success View */
                            <div style={{ textAlign: "center", padding: "20px 0" }}>
                                <div style={{ fontSize: 60, color: C.green, marginBottom: 16 }}>✓</div>
                                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Appointment Booked!</h2>
                                <p style={{ color: C.slateL, lineHeight: 1.6, marginBottom: 24 }}>
                                    Your consultation with <strong>{bookingSuccess.doctorName}</strong> has been scheduled successfully.
                                </p>
                                <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, textAlign: "left", marginBottom: 24 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
                                        <span style={{ color: C.slateL }}>Date:</span>
                                        <span style={{ fontWeight: 600 }}>{bookingSuccess.date}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
                                        <span style={{ color: C.slateL }}>Time Slot:</span>
                                        <span style={{ fontWeight: 600 }}>{bookingSuccess.time} AM/PM</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                                        <span style={{ color: C.slateL }}>Confirmation Email:</span>
                                        <span style={{ fontWeight: 600 }}>{bookingSuccess.email}</span>
                                    </div>
                                </div>
                                <Btn onClick={handleCloseModal} style={{ padding: "12px 32px" }}>Done</Btn>
                            </div>
                        ) : (
                            /* Booking Form View */
                            <form onSubmit={handleBookSubmit}>
                                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Book Appointment</h2>
                                <p style={{ color: C.slateL, fontSize: 13, marginBottom: 20 }}>Fill in the details to schedule a consultation.</p>

                                {/* Choose Doctor Dropdown */}
                                {isDirectBooking && h?.doctors && h.doctors.length > 0 && (
                                    <div style={{ marginBottom: 20 }}>
                                        <label style={{ display: "block", fontSize: 12, color: C.slateL, fontWeight: 600, marginBottom: 8 }}>Choose Doctor</label>
                                        <select
                                            value={bookingDoc.id}
                                            onChange={(e) => {
                                                const docId = parseInt(e.target.value, 10);
                                                const selectedDoc = h.doctors.find(d => d.id === docId);
                                                if (selectedDoc) {
                                                    setBookingDoc(selectedDoc);
                                                    setSelectedDate(null);
                                                    setSelectedTime(null);
                                                }
                                            }}
                                            style={{
                                                width: "100%",
                                                padding: "10px 12px",
                                                borderRadius: 8,
                                                border: `1px solid ${C.border}`,
                                                background: C.white,
                                                color: C.black,
                                                fontSize: 13,
                                                boxSizing: "border-box",
                                                outline: "none"
                                            }}
                                        >
                                            {h.doctors.map(d => (
                                                <option key={d.id} value={d.id}>
                                                    {d.name} ({d.specialization})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Doctor Summary Card inside Modal */}
                                <div style={{ display: "flex", gap: 16, background: "rgba(255,255,255,0.02)", padding: 16, borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 20 }}>
                                    {bookingDoc.photo_url ? (
                                        <img src={bookingDoc.photo_url} alt={bookingDoc.name} style={{ width: 56, height: 56, borderRadius: 28, objectFit: "cover" }} />
                                    ) : (
                                        <div style={{ fontSize: 32, width: 56, height: 56, background: "rgba(255,255,255,0.05)", borderRadius: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>👨‍⚕️</div>
                                    )}
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>{bookingDoc.name}</h4>
                                        <p style={{ margin: "2px 0 0", color: C.tealL, fontSize: 12, fontWeight: 600 }}>{bookingDoc.specialization}</p>
                                        <p style={{ margin: "4px 0 0", color: C.slateL, fontSize: 11 }}>Fee: ${bookingDoc.consultation_fee} • {Math.abs(bookingDoc.experience_yrs)} yrs exp</p>
                                    </div>
                                </div>

                                {/* Availability Text */}
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.goldL, fontWeight: 600, background: "rgba(212,168,67,0.1)", padding: "8px 12px", borderRadius: 8 }}>
                                        <span>🕒</span> Doctor Availability: {bookingDoc.available_days ? `${parseAvailableDays(bookingDoc.available_days).join(', ')} (${bookingDoc.available_from ? bookingDoc.available_from.slice(0, 5) : '10:00'} - ${bookingDoc.available_to ? bookingDoc.available_to.slice(0, 5) : '17:00'})` : (bookingDoc.operating_hours || "Monday - Friday, 9:00 AM - 5:00 PM")}
                                    </div>
                                </div>

                                {/* Date Selector (Monthly Calendar) */}
                                <div style={{ marginBottom: 20 }}>
                                    <label style={{ display: "block", fontSize: 12, color: C.slateL, fontWeight: 600, marginBottom: 8 }}>Select Date</label>

                                    <div style={{
                                        background: "rgba(255,255,255,0.01)",
                                        border: `1px solid ${C.border}`,
                                        borderRadius: 14,
                                        padding: 16,
                                    }}>
                                        {/* Month/Year Header */}
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                            <span style={{ fontSize: 14, fontWeight: 800, color: C.black }}>
                                                {new Date(currentYear, currentMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                            </span>
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <button
                                                    type="button"
                                                    disabled={isPrevDisabled}
                                                    onClick={handlePrevMonth}
                                                    style={{
                                                        background: isPrevDisabled ? "transparent" : "rgba(255,255,255,0.03)",
                                                        border: `1px solid ${C.border}`,
                                                        borderRadius: 8,
                                                        width: 28,
                                                        height: 28,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        cursor: isPrevDisabled ? "not-allowed" : "pointer",
                                                        opacity: isPrevDisabled ? 0.3 : 1,
                                                        color: C.black,
                                                        fontSize: 11
                                                    }}
                                                >
                                                    ◀
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleNextMonth}
                                                    style={{
                                                        background: "rgba(255,255,255,0.03)",
                                                        border: `1px solid ${C.border}`,
                                                        borderRadius: 8,
                                                        width: 28,
                                                        height: 28,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        cursor: "pointer",
                                                        color: C.black,
                                                        fontSize: 11
                                                    }}
                                                >
                                                    ▶
                                                </button>
                                            </div>
                                        </div>

                                        {/* Calendar Grid */}
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, textAlign: "center" }}>
                                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                                                <span key={d} style={{ fontSize: 11, color: C.slateL, fontWeight: 600, paddingBottom: 6 }}>{d}</span>
                                            ))}
                                            {generateCalendarDays(currentYear, currentMonth).map((date, idx) => {
                                                if (!date) return <div key={idx} />;

                                                const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();

                                                // Check availability
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);
                                                const dateStart = new Date(date);
                                                dateStart.setHours(0, 0, 0, 0);

                                                const isPast = dateStart < today;
                                                const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                                                const dayName = dayMap[date.getDay()];
                                                const isAllowedDay = parseAvailableDays(bookingDoc.available_days).includes(dayName);
                                                const isAvailable = !isPast && isAllowedDay;

                                                return (
                                                    <div
                                                        key={idx}
                                                        onClick={() => {
                                                            if (isAvailable) {
                                                                setSelectedDate(date);
                                                                setSelectedTime(null);
                                                            }
                                                        }}
                                                        style={{
                                                            padding: "8px 0",
                                                            borderRadius: 10,
                                                            fontSize: 13,
                                                            fontWeight: isSelected ? 800 : 500,
                                                            cursor: isAvailable ? "pointer" : "not-allowed",
                                                            background: isSelected
                                                                ? `linear-gradient(135deg, ${C.teal}, ${C.tealL})`
                                                                : isAvailable ? "rgba(11, 181, 160, 0.05)" : "transparent",
                                                            border: `1px solid ${isSelected ? C.tealL : isAvailable ? "rgba(11, 181, 160, 0.15)" : "transparent"}`,
                                                            color: isSelected
                                                                ? C.black
                                                                : isAvailable ? C.black : "rgba(0, 0, 0, 0.25)",
                                                            transition: "all 0.15s",
                                                            opacity: isAvailable ? 1 : 0.4,
                                                        }}
                                                        title={!isAvailable ? (isPast ? "Past date" : `Doctor not available on ${dayName}s`) : ""}
                                                    >
                                                        {date.getDate()}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Time Slot Selector (Only visible after selecting a date) */}
                                {selectedDate && (
                                    <div style={{ marginBottom: 20 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                            <label style={{ fontSize: 12, color: C.slateL, fontWeight: 600 }}>Select Time Slot</label>
                                            {loadingBusy && <span style={{ fontSize: 11, color: C.tealL }}>Loading slots...</span>}
                                        </div>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                                            {generateTimeSlots(bookingDoc).map((time, idx) => {
                                                const isSelected = selectedTime === time;
                                                const isBusy = busySlots.includes(time);
                                                const [hh, mm] = time.split(':');
                                                const displayTime = `${hh}:${mm} ${Number(hh) >= 12 ? 'PM' : 'AM'}`;

                                                return (
                                                    <div
                                                        key={idx}
                                                        onClick={() => {
                                                            if (!isBusy) {
                                                                setSelectedTime(time);
                                                            }
                                                        }}
                                                        style={{
                                                            padding: "8px 4px",
                                                            borderRadius: 8,
                                                            textAlign: "center",
                                                            background: isSelected
                                                                ? C.teal
                                                                : isBusy
                                                                    ? "rgba(224, 82, 82, 0.05)"
                                                                    : "rgba(255, 255, 255, 0.02)",
                                                            border: `1px solid ${isSelected
                                                                ? C.tealL
                                                                : isBusy
                                                                    ? C.red
                                                                    : C.border
                                                                }`,
                                                            color: isSelected
                                                                ? C.black
                                                                : isBusy
                                                                    ? C.red
                                                                    : C.slateL,
                                                            cursor: isBusy ? "not-allowed" : "pointer",
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                            transition: "all 0.2s",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            gap: 4
                                                        }}
                                                        title={isBusy ? "This time slot is fully booked/busy" : ""}
                                                    >
                                                        {isBusy && <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.red, display: "inline-block" }}></span>}
                                                        {displayTime}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Patient Form */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: 12, color: C.slateL, fontWeight: 600, marginBottom: 6 }}>Full Name</label>
                                        <input required value={formName} onChange={e => setFormName(e.target.value)} type="text" placeholder="John Doe" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.02)", color: C.black, fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: 12, color: C.slateL, fontWeight: 600, marginBottom: 6 }}>Phone Number</label>
                                        <input required value={formPhone} onChange={e => setFormPhone(e.target.value)} type="tel" placeholder="+1 (555) 019-2834" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.02)", color: C.black, fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                                    </div>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <label style={{ display: "block", fontSize: 12, color: C.slateL, fontWeight: 600, marginBottom: 6 }}>Email Address</label>
                                    <input required value={formEmail} onChange={e => setFormEmail(e.target.value)} type="email" placeholder="johndoe@example.com" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.02)", color: C.black, fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: 12, color: C.slateL, fontWeight: 600, marginBottom: 6 }}>Platform</label>
                                        <select value={formPlatform} onChange={e => setFormPlatform(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, color: C.black, fontSize: 13, boxSizing: "border-box", outline: "none", opacity: formType !== "Telemedicine" ? 0.5 : 1 }}>
                                            <option value="zoom">Zoom Video</option>
                                            <option value="inperson">In person</option>
                                            <option value="audio_call">Phone call</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: 12, color: C.slateL, fontWeight: 600, marginBottom: 6 }}>Duration (mins)</label>
                                        <select
                                            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, color: C.black, fontSize: 13, boxSizing: "border-box", outline: "none" }}
                                            value={duration}
                                            onChange={e => setDuration(e.target.value)}
                                        >
                                            <option value={15}>15 Minutes</option>
                                            <option value={30}>30 Minutes</option>
                                            <option value={45}>45 Minutes</option>
                                            <option value={60}>60 Minutes</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ display: "block", fontSize: 12, color: C.slateL, fontWeight: 600, marginBottom: 6 }}>Symptom Description / Notes</label>
                                    <textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} placeholder="Describe symptoms or reasons for booking..." style={{ width: "100%", height: 60, padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.02)", color: C.black, fontSize: 13, boxSizing: "border-box", outline: "none", resize: "none" }} />
                                </div>

                                <Btn type="submit" disabled={bookingLoading} style={{ width: "100%", padding: "12px", fontWeight: 700 }}>
                                    {bookingLoading ? "Booking in progress..." : "Confirm & Book Appointment"}
                                </Btn>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default HospitalDetails;
