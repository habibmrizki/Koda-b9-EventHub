import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addEvent,
  updateEvent,
} from "../../../redux/slices/dataSlices/eventSlice";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  UploadCloud,
  MapPin,
  Tv,
  X,
  Loader2,
} from "lucide-react";

const initialFormState = {
  coverImage: null,
  title: "",
  description: "",
  categories: [],
  community: "No community",
  eventDate: "",
  startTime: "",
  endTime: "",
  format: "In Person",
  location: "",
  capacity: "100",
  speakers: [],
  speakerInput: "",
};

const getMappedEventData = (existingEvent) => {
  const locString =
    existingEvent.location?.address ||
    existingEvent.location?.city ||
    (typeof existingEvent.location === "string" ? existingEvent.location : "");

  return {
    coverImage:
      existingEvent.coverImage ||
      existingEvent.image ||
      existingEvent.media?.cover_url ||
      existingEvent.media?.thumbnail_url ||
      null,
    title: existingEvent.title || "",
    description: existingEvent.description || existingEvent.overview || "",
    categories: existingEvent.tags || existingEvent.categories || [],
    community:
      existingEvent.organizer?.community_name ||
      existingEvent.community ||
      "No community",
    eventDate: existingEvent.schedule?.date || existingEvent.eventDate || "",
    startTime:
      existingEvent.schedule?.start_time || existingEvent.startTime || "",
    endTime: existingEvent.schedule?.end_time || existingEvent.endTime || "",
    format:
      existingEvent.location?.type === "offline" ||
      existingEvent.format === "In Person"
        ? "In Person"
        : "Online",
    location: locString,
    capacity: String(
      existingEvent.tickets?.capacity || existingEvent.capacity || "100",
    ),
    speakers: existingEvent.speakers || [],
    speakerInput: "",
  };
};

const CreateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const events = useSelector((state) => state.events?.items || []);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadedId, setLoadedId] = useState(null);

  const [formData, setFormData] = useState(initialFormState);

  const currentId = id || null;

  if (currentId !== loadedId) {
    if (!currentId) {
      setLoadedId(null);
      setFormData(initialFormState);
      setCurrentStep(1);
    } else if (events.length > 0) {
      const existingEvent = events.find((e) => String(e.id) === String(id));
      if (existingEvent) {
        setLoadedId(currentId);
        setFormData(getMappedEventData(existingEvent));
      }
    }
  }

  const compressImage = (
    file,
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.7,
  ) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(dataUrl);
        };
        img.onerror = () => resolve(event.target.result);
      };
      reader.onerror = () => resolve(null);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (cat) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressedUrl = await compressImage(file);
      if (compressedUrl) {
        setFormData((prev) => ({ ...prev, coverImage: compressedUrl }));
      }
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
    if (e) e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    setTimeout(() => {
      if (id) {
        dispatch(updateEvent({ id, ...formData }));
      } else {
        dispatch(addEvent(formData));
      }
      setIsSubmitting(false);
      setCurrentStep(4);
    }, 1500);
  };
  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto">
        {/* Step Indicator Header */}
        {currentStep <= 3 && !isSubmitting && (
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => (currentStep === 1 ? navigate(-1) : prevStep())}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
              <span className="font-semibold text-gray-900 ml-1">
                {id ? "Edit Event" : "Create Event"}
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

        {/* LOADING PROCESSING SCREEN */}
        {isSubmitting && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 shadow-sm flex flex-col items-center justify-center text-center space-y-6 my-12">
            <div className="relative flex items-center justify-center w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-orange-100 animate-ping opacity-75"></div>
              <div className="w-20 h-20 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin flex items-center justify-center shadow-inner"></div>
              <Loader2
                className="absolute text-orange-500 animate-spin"
                size={32}
              />
            </div>
            <div className="space-y-2 max-w-sm">
              <h2 className="text-xl font-bold text-gray-900">
                {id
                  ? "Menyimpan Perubahan Event..."
                  : "Menerbitkan Event Anda..."}
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Mohon tunggu sebentar, kami sedang memproses data dan menyimpan
                detail event Anda ke sistem.
              </p>
            </div>
            {/* Animated Progress Bar */}
            <div className="w-64 bg-gray-100 h-2 rounded-full overflow-hidden relative">
              <div className="h-full gradient-to-r from-orange-400 via-amber-500 to-emerald-500 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        )}

        {/* Basic Information */}
        {currentStep === 1 && !isSubmitting && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {id ? "Edit Basic Information" : "Basic Information"}
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
                  Categories
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
        {currentStep === 2 && !isSubmitting && (
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

        {/*  Speakers dan Review */}
        {currentStep === 3 && !isSubmitting && (
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
                disabled={isSubmitting}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-5 py-2 rounded-lg text-xs font-medium transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>{id ? "Update Event" : "Publish Event"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/*  Success Screen */}
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
