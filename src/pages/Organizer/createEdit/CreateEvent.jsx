// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { addEvent } from "../../../redux/slices/dataSlices/dataSlice";
// import {
//   ArrowLeft,
//   ArrowRight,
//   Check,
//   UploadCloud,
//   MapPin,
//   Tv,
//   X,
// } from "lucide-react";

// const CreateEvent = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [currentStep, setCurrentStep] = useState(1);

//   const [formData, setFormData] = useState({
//     coverImage: null,
//     title: "",
//     description: "",
//     categories: [],
//     community: "No community",
//     eventDate: "",
//     startTime: "",
//     endTime: "",
//     format: "In Person",
//     location: "Bandung, West Java",
//     capacity: "100",
//     speakers: [],
//     speakerInput: "",
//   });

//   // Handler Perubahan Field Text / Select
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handler Multi-Select Category Toggle
//   const handleCategoryToggle = (cat) => {
//     setFormData((prev) => {
//       const exists = prev.categories.includes(cat);
//       if (exists) {
//         return {
//           ...prev,
//           categories: prev.categories.filter((c) => c !== cat),
//         };
//       } else {
//         return {
//           ...prev,
//           categories: [...prev.categories, cat],
//         };
//       }
//     });
//   };

//   // Handler Upload Gambar
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData((prev) => ({ ...prev, coverImage: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handler Hapus Gambar Upload
//   const handleRemoveImage = () => {
//     setFormData((prev) => ({ ...prev, coverImage: null }));
//   };

//   // Navigasi Step
//   const nextStep = () => setCurrentStep((prev) => prev + 1);
//   const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

//   // Handler Speaker
//   const handleAddSpeaker = () => {
//     if (formData.speakerInput.trim()) {
//       setFormData((prev) => ({
//         ...prev,
//         speakers: [...prev.speakers, prev.speakerInput.trim()],
//         speakerInput: "",
//       }));
//     }
//   };

//   const handleRemoveSpeaker = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       speakers: prev.speakers.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const formattedEvent = {
//       id: Date.now(),
//       title: formData.title || "Untitled Event",
//       dateLocation: `${formData.eventDate || "TBD"} · ${formData.location || "Online"}`,
//       attendees: 0,
//       capacity: parseInt(formData.capacity) || 100,
//       status: "Active",
//       image:
//         formData.coverImage ||
//         "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80",
//       description: formData.description,
//       tags: formData.categories,
//       speakers: formData.speakers,
//     };

//     dispatch(addEvent(formattedEvent));
//     nextStep();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50/50 py-8 px-4 font-sans text-gray-800">
//       <div className="max-w-3xl mx-auto">
//         {currentStep <= 3 && (
//           <div className="flex items-center justify-between mb-8">
//             <button
//               onClick={() => (currentStep === 1 ? navigate(-1) : prevStep())}
//               className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
//             >
//               <ArrowLeft size={16} />
//               <span>Back</span>
//               <span className="font-semibold text-gray-900 ml-1">
//                 Create Event
//               </span>
//             </button>

//             <div className="flex items-center gap-3">
//               {[1, 2, 3].map((step) => {
//                 const isCompleted = step < currentStep;
//                 const isCurrent = step === currentStep;

//                 return (
//                   <React.Fragment key={step}>
//                     <div
//                       className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
//                         isCompleted
//                           ? "bg-orange-500 text-white"
//                           : isCurrent
//                             ? "bg-orange-500 text-white shadow-sm ring-2 ring-orange-200"
//                             : "bg-gray-200 text-gray-500"
//                       }`}
//                     >
//                       {isCompleted ? <Check size={14} /> : step}
//                     </div>
//                     {step < 3 && (
//                       <div
//                         className={`w-8 h-0.5 rounded ${
//                           step < currentStep ? "bg-orange-500" : "bg-gray-200"
//                         }`}
//                       />
//                     )}
//                   </React.Fragment>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Basic Information */}
//         {currentStep === 1 && (
//           <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">
//                 Basic Information
//               </h1>
//               <p className="text-xs text-gray-500 mt-1">
//                 Tell attendees what your event is about.
//               </p>
//             </div>

//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 nextStep();
//               }}
//               className="space-y-5"
//             >
//               {/* Cover Image Upload Area */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-2">
//                   Cover Image
//                 </label>
//                 {formData.coverImage ? (
//                   <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 group">
//                     <img
//                       src={formData.coverImage}
//                       alt="Cover Preview"
//                       className="w-full h-full object-cover"
//                     />
//                     <button
//                       type="button"
//                       onClick={handleRemoveImage}
//                       className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
//                     >
//                       <X size={14} />
//                     </button>
//                   </div>
//                 ) : (
//                   <label className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-orange-300 transition-colors cursor-pointer bg-gray-50/50 flex flex-col items-center justify-center">
//                     <UploadCloud className="text-gray-400 mb-2" size={32} />
//                     <p className="text-xs text-gray-600 font-medium">
//                       Click to upload or drag and drop
//                     </p>
//                     <p className="text-[10px] text-gray-400 mt-1">
//                       PNG, JPG up to 10MB · 16:9 recommended
//                     </p>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="hidden"
//                     />
//                   </label>
//                 )}
//               </div>

//               {/* Event Title */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                   Event Title
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   placeholder="Go Concurrency Workshop"
//                   value={formData.title}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300"
//                 />
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   rows={4}
//                   placeholder="What will attendees learn or experience?"
//                   value={formData.description}
//                   onChange={handleChange}
//                   className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300 resize-none"
//                 />
//               </div>

//               {/* Categories  */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                   Categories (Pilih satu atau lebih)
//                 </label>
//                 <div className="flex flex-wrap gap-2 pt-1">
//                   {[
//                     "Technology",
//                     "Programming",
//                     "Design",
//                     "Business",
//                     "Career",
//                     "AI",
//                     "Music",
//                   ].map((cat) => {
//                     const isSelected = formData.categories.includes(cat);
//                     return (
//                       <button
//                         key={cat}
//                         type="button"
//                         onClick={() => handleCategoryToggle(cat)}
//                         className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
//                           isSelected
//                             ? "bg-orange-500 text-white border-orange-500 shadow-sm"
//                             : "bg-white text-gray-700 border-gray-200 hover:border-orange-300"
//                         }`}
//                       >
//                         {cat} {isSelected && "✓"}
//                       </button>
//                     );
//                   })}
//                 </div>
//                 {formData.categories.length === 0 && (
//                   <p className="text-[10px] text-orange-500 mt-1">
//                     Disarankan memilih minimal 1 kategori.
//                   </p>
//                 )}
//               </div>

//               {/* Community */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                   Community (optional)
//                 </label>
//                 <select
//                   name="community"
//                   value={formData.community}
//                   onChange={handleChange}
//                   className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700 bg-white"
//                 >
//                   <option value="No community">No community</option>
//                   <option value="Golang Indonesia">Golang Indonesia</option>
//                 </select>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-between items-center pt-4">
//                 <button
//                   type="button"
//                   onClick={() => navigate(-1)}
//                   className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-xs font-medium transition-all shadow-sm"
//                 >
//                   <span>Continue</span>
//                   <ArrowRight size={14} />
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Date, Location dan Capacity */}
//         {currentStep === 2 && (
//           <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">
//                 Date, Location & Capacity
//               </h1>
//               <p className="text-xs text-gray-500 mt-1">
//                 When and where is your event?
//               </p>
//             </div>

//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 nextStep();
//               }}
//               className="space-y-5"
//             >
//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                   Event Date
//                 </label>
//                 <input
//                   type="date"
//                   name="eventDate"
//                   value={formData.eventDate}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                     Start Time
//                   </label>
//                   <input
//                     type="time"
//                     name="startTime"
//                     value={formData.startTime}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                     End Time
//                   </label>
//                   <input
//                     type="time"
//                     name="endTime"
//                     value={formData.endTime}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-2">
//                   Event Format
//                 </label>
//                 <div className="inline-flex p-1 bg-gray-100 rounded-xl gap-1">
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setFormData({ ...formData, format: "In Person" })
//                     }
//                     className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
//                       formData.format === "In Person"
//                         ? "bg-white text-gray-900 shadow-sm"
//                         : "text-gray-500 hover:text-gray-700"
//                     }`}
//                   >
//                     <MapPin size={13} className="text-red-500" />
//                     In Person
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setFormData({ ...formData, format: "Online" })
//                     }
//                     className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
//                       formData.format === "Online"
//                         ? "bg-white text-gray-900 shadow-sm"
//                         : "text-gray-500 hover:text-gray-700"
//                     }`}
//                   >
//                     <Tv size={13} />
//                     Online
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                   {formData.format === "In Person"
//                     ? "Location"
//                     : "Meeting Link"}
//                 </label>
//                 <input
//                   type="text"
//                   name="location"
//                   placeholder={
//                     formData.format === "In Person"
//                       ? "Bandung, West Java"
//                       : "https://zoom.us/j/..."
//                   }
//                   value={formData.location}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700 placeholder:text-gray-300"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                   Capacity
//                 </label>
//                 <input
//                   type="number"
//                   name="capacity"
//                   placeholder="100"
//                   value={formData.capacity}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700"
//                 />
//               </div>

//               <div className="flex justify-between items-center pt-4">
//                 <button
//                   type="button"
//                   onClick={prevStep}
//                   className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg border border-gray-200 transition-all"
//                 >
//                   <ArrowLeft size={13} />
//                   <span>Back</span>
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-xs font-medium transition-all shadow-sm"
//                 >
//                   <span>Continue</span>
//                   <ArrowRight size={14} />
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Speakers dan Review */}
//         {currentStep === 3 && (
//           <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">
//                 Speakers & Review
//               </h1>
//               <p className="text-xs text-gray-500 mt-1">
//                 Add speakers and confirm your event details.
//               </p>
//             </div>

//             <div className="space-y-3">
//               <label className="block text-xs font-semibold text-gray-700">
//                 Speakers (optional)
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   name="speakerInput"
//                   placeholder="Speaker name and title"
//                   value={formData.speakerInput}
//                   onChange={handleChange}
//                   className="flex-1 px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300"
//                 />
//                 <button
//                   type="button"
//                   onClick={handleAddSpeaker}
//                   className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200 transition-all cursor-pointer"
//                 >
//                   Add
//                 </button>
//               </div>

//               <div className="flex flex-wrap gap-2 pt-1">
//                 {formData.speakers.map((speaker, index) => (
//                   <span
//                     key={index}
//                     className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
//                   >
//                     {speaker}
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveSpeaker(index)}
//                       className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
//                     >
//                       <X size={12} />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* Review Summary */}
//             <div className="border border-gray-100 rounded-xl overflow-hidden text-xs divide-y divide-gray-100">
//               <div className="flex justify-between p-3.5 bg-gray-50/50">
//                 <span className="text-gray-500">Title</span>
//                 <span className="font-semibold text-gray-900">
//                   {formData.title || "Go Concurrency Workshop"}
//                 </span>
//               </div>
//               <div className="flex justify-between p-3.5 items-center">
//                 <span className="text-gray-500">Categories</span>
//                 <div className="flex flex-wrap gap-1 justify-end">
//                   {formData.categories.length > 0 ? (
//                     formData.categories.map((cat, idx) => (
//                       <span
//                         key={idx}
//                         className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 font-medium text-[11px] border border-orange-100"
//                       >
//                         {cat}
//                       </span>
//                     ))
//                   ) : (
//                     <span className="text-gray-400 font-medium">
//                       Belum ada kategori
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <div className="flex justify-between p-3.5 bg-gray-50/50">
//                 <span className="text-gray-500">Date</span>
//                 <span className="font-medium text-gray-800">
//                   {formData.eventDate || "2026-08-12"}
//                 </span>
//               </div>
//               <div className="flex justify-between p-3.5">
//                 <span className="text-gray-500">Time</span>
//                 <span className="font-medium text-gray-800">
//                   {formData.startTime && formData.endTime
//                     ? `${formData.startTime} – ${formData.endTime}`
//                     : "12:12 – 14:14"}
//                 </span>
//               </div>
//               <div className="flex justify-between p-3.5 bg-gray-50/50">
//                 <span className="text-gray-500">Location</span>
//                 <span className="font-medium text-gray-800">
//                   {formData.location || "Bandung"}
//                 </span>
//               </div>
//               <div className="flex justify-between p-3.5">
//                 <span className="text-gray-500">Capacity</span>
//                 <span className="font-medium text-gray-800">
//                   {formData.capacity || 100} attendees
//                 </span>
//               </div>
//               <div className="flex justify-between p-3.5 bg-gray-50/50">
//                 <span className="text-gray-500">Speakers</span>
//                 <span className="font-medium text-gray-800">
//                   {formData.speakers.length} added
//                 </span>
//               </div>
//             </div>

//             <div className="flex justify-between items-center pt-4">
//               <button
//                 type="button"
//                 onClick={prevStep}
//                 className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg border border-gray-200 transition-all cursor-pointer"
//               >
//                 <ArrowLeft size={13} />
//                 <span>Back</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-xs font-medium transition-all shadow-sm cursor-pointer"
//               >
//                 <Check size={14} />
//                 <span>Publish Event</span>
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Success Screen */}
//         {currentStep === 4 && (
//           <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
//             <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-2">
//               <Check size={32} />
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900">Event Created!</h1>
//             <p className="text-xs text-gray-400">
//               Event berhasil diterbitkan dan ditambahkan ke dashboard organizer.
//             </p>
//             <button
//               onClick={() => navigate("/organizer")}
//               className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition-all cursor-pointer"
//             >
//               Kembali ke Dashboard
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CreateEvent;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addEvent } from "../../../redux/slices/dataSlices/dataSlice";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  UploadCloud,
  MapPin,
  Tv,
  X,
} from "lucide-react";

const CreateEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    coverImage: null,
    title: "",
    description: "",
    categories: [],
    community: "No community",
    eventDate: "",
    startTime: "",
    endTime: "",
    format: "In Person",
    location: "Bandung, West Java",
    capacity: "100",
    speakers: [],
    speakerInput: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (cat) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(cat);
      if (exists) {
        return {
          ...prev,
          categories: prev.categories.filter((c) => c !== cat),
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, cat],
        };
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, coverImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, coverImage: null }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleAddSpeaker = () => {
    if (formData.speakerInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        speakers: [...prev.speakers, prev.speakerInput.trim()],
        speakerInput: "",
      }));
    }
  };

  const handleRemoveSpeaker = (index) => {
    setFormData((prev) => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addEvent(formData));
    nextStep();
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto">
        {currentStep <= 3 && (
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => (currentStep === 1 ? navigate(-1) : prevStep())}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
              <span className="font-semibold text-gray-900 ml-1">
                Create Event
              </span>
            </button>

            <div className="flex items-center gap-3">
              {[1, 2, 3].map((step) => {
                const isCompleted = step < currentStep;
                const isCurrent = step === currentStep;

                return (
                  <React.Fragment key={step}>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                        isCompleted
                          ? "bg-orange-500 text-white"
                          : isCurrent
                            ? "bg-orange-500 text-white shadow-sm ring-2 ring-orange-200"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? <Check size={14} /> : step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-8 h-0.5 rounded ${
                          step < currentStep ? "bg-orange-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Basic Information */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Basic Information
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Tell attendees what your event is about.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                nextStep();
              }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Cover Image
                </label>
                {formData.coverImage ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 group">
                    <img
                      src={formData.coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-orange-300 transition-colors cursor-pointer bg-gray-50/50 flex flex-col items-center justify-center">
                    <UploadCloud className="text-gray-400 mb-2" size={32} />
                    <p className="text-xs text-gray-600 font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      PNG, JPG up to 10MB · 16:9 recommended
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Go Concurrency Workshop"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="What will attendees learn or experience?"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Categories (Pilih satu atau lebih)
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "Technology",
                    "Programming",
                    "Design",
                    "Business",
                    "Career",
                    "AI",
                    "Music",
                  ].map((cat) => {
                    const isSelected = formData.categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryToggle(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
                          isSelected
                            ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                            : "bg-white text-gray-700 border-gray-200 hover:border-orange-300"
                        }`}
                      >
                        {cat} {isSelected && "✓"}
                      </button>
                    );
                  })}
                </div>
                {formData.categories.length === 0 && (
                  <p className="text-[10px] text-orange-500 mt-1">
                    Disarankan memilih minimal 1 kategori.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Community (optional)
                </label>
                <select
                  name="community"
                  value={formData.community}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700 bg-white"
                >
                  <option value="No community">No community</option>
                  <option value="Golang Indonesia">Golang Indonesia</option>
                </select>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-xs font-medium transition-all shadow-sm cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Date, Location dan Capacity */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Date, Location & Capacity
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                When and where is your event?
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                nextStep();
              }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Event Date
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Event Format
                </label>
                <div className="inline-flex p-1 bg-gray-100 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, format: "In Person" })
                    }
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      formData.format === "In Person"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <MapPin size={13} className="text-red-500" />
                    In Person
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, format: "Online" })
                    }
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      formData.format === "Online"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Tv size={13} />
                    Online
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  {formData.format === "In Person"
                    ? "Location"
                    : "Meeting Link"}
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder={
                    formData.format === "In Person"
                      ? "Bandung, West Java"
                      : "https://zoom.us/j/..."
                  }
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700 placeholder:text-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  placeholder="100"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700"
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg border border-gray-200 transition-all cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-xs font-medium transition-all shadow-sm cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Speakers dan Review */}
        {currentStep === 3 && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Speakers & Review
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Add speakers and confirm your event details.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-700">
                Speakers (optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="speakerInput"
                  placeholder="Speaker name and title"
                  value={formData.speakerInput}
                  onChange={handleChange}
                  className="flex-1 px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={handleAddSpeaker}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200 transition-all cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {formData.speakers.map((speaker, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                  >
                    {speaker}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpeaker(index)}
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Review Summary */}
            <div className="border border-gray-100 rounded-xl overflow-hidden text-xs divide-y divide-gray-100">
              <div className="flex justify-between p-3.5 bg-gray-50/50">
                <span className="text-gray-500">Title</span>
                <span className="font-semibold text-gray-900">
                  {formData.title || "Go Concurrency Workshop"}
                </span>
              </div>
              <div className="flex justify-between p-3.5 items-center">
                <span className="text-gray-500">Categories</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {formData.categories.length > 0 ? (
                    formData.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 font-medium text-[11px] border border-orange-100"
                      >
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 font-medium">
                      Belum ada kategori
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between p-3.5 bg-gray-50/50">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-800">
                  {formData.eventDate || "2026-08-12"}
                </span>
              </div>
              <div className="flex justify-between p-3.5">
                <span className="text-gray-500">Time</span>
                <span className="font-medium text-gray-800">
                  {formData.startTime && formData.endTime
                    ? `${formData.startTime} – ${formData.endTime}`
                    : "12:12 – 14:14"}
                </span>
              </div>
              <div className="flex justify-between p-3.5 bg-gray-50/50">
                <span className="text-gray-500">Location</span>
                <span className="font-medium text-gray-800">
                  {formData.location || "Bandung"}
                </span>
              </div>
              <div className="flex justify-between p-3.5">
                <span className="text-gray-500">Capacity</span>
                <span className="font-medium text-gray-800">
                  {formData.capacity || 100} attendees
                </span>
              </div>
              <div className="flex justify-between p-3.5 bg-gray-50/50">
                <span className="text-gray-500">Speakers</span>
                <span className="font-medium text-gray-800">
                  {formData.speakers.length} added
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg border border-gray-200 transition-all cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-xs font-medium transition-all shadow-sm cursor-pointer"
              >
                <Check size={14} />
                <span>Publish Event</span>
              </button>
            </div>
          </div>
        )}

        {/* Success Screen */}
        {currentStep === 4 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-2">
              <Check size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Event Created!</h1>
            <p className="text-xs text-gray-400">
              Event berhasil diterbitkan dan ditambahkan ke dashboard organizer.
            </p>
            <button
              onClick={() => navigate("/organizer")}
              className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition-all cursor-pointer"
            >
              Kembali ke Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;
