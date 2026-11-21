import sys

SETTINGS_FILE = "Ocean-Weligama/artifacts/ocean-weligama/src/pages/admin/settings.tsx"

with open(SETTINGS_FILE, "r") as f:
    content = f.read()

# 1. Add HeartHandshake, TrendingUp to lucide-react imports
lucide_target = """  CheckCircle2,
  Wind,
} from "lucide-react";"""

lucide_replacement = """  CheckCircle2,
  Wind,
  HeartHandshake,
  TrendingUp,
} from "lucide-react";"""

assert lucide_target in content, "lucide_target not found"
content = content.replace(lucide_target, lucide_replacement, 1)

# 2. Add AboutValuesSettings interface and update AboutSettings
interface_target = """export interface AboutRooftopSettings {
  headingLead: string;
  tab1Label: string;
  tab2Label: string;

  // Morning Mode
  morningBadge: string;
  morningHeadingHighlight: string;
  morningSubtitle: string;
  morningCard1Tag: string;
  morningCard1Title: string;
  morningCard1Desc: string;
  morningCard2Tag: string;
  morningCard2Title: string;
  morningCard2Desc: string;
  morningPerk1: string;
  morningPerk2: string;
  morningImageUrl: string;
  morningImageTag: string;
  morningDockNote: string;
  morningDockTime: string;

  // Sunset / Golden Hour Mode
  sunsetBadge: string;
  sunsetHeadingHighlight: string;
  sunsetSubtitle: string;
  sunsetCard1Tag: string;
  sunsetCard1Title: string;
  sunsetCard1Desc: string;
  sunsetCard2Tag: string;
  sunsetCard2Title: string;
  sunsetCard2Desc: string;
  sunsetPerk1: string;
  sunsetPerk2: string;
  sunsetImageUrl: string;
  sunsetImageTag: string;
  sunsetDockNote: string;
  sunsetDockTime: string;
}

export interface AboutSettings {
  hero: AboutHeroSettings;
  story: AboutStorySettings;
  experience: AboutExperienceSettings;
  sanctuary: AboutSanctuarySettings;
  rooftop: AboutRooftopSettings;
}"""

interface_replacement = """export interface AboutRooftopSettings {
  headingLead: string;
  tab1Label: string;
  tab2Label: string;

  // Morning Mode
  morningBadge: string;
  morningHeadingHighlight: string;
  morningSubtitle: string;
  morningCard1Tag: string;
  morningCard1Title: string;
  morningCard1Desc: string;
  morningCard2Tag: string;
  morningCard2Title: string;
  morningCard2Desc: string;
  morningPerk1: string;
  morningPerk2: string;
  morningImageUrl: string;
  morningImageTag: string;
  morningDockNote: string;
  morningDockTime: string;

  // Sunset / Golden Hour Mode
  sunsetBadge: string;
  sunsetHeadingHighlight: string;
  sunsetSubtitle: string;
  sunsetCard1Tag: string;
  sunsetCard1Title: string;
  sunsetCard1Desc: string;
  sunsetCard2Tag: string;
  sunsetCard2Title: string;
  sunsetCard2Desc: string;
  sunsetPerk1: string;
  sunsetPerk2: string;
  sunsetImageUrl: string;
  sunsetImageTag: string;
  sunsetDockNote: string;
  sunsetDockTime: string;
}

export interface AboutValuesSettings {
  badge: string;
  headingLead: string;
  headingHighlight: string;
  subtitle: string;

  // Pillar 1: Pure Local Roots
  pillar1Badge: string;
  pillar1Tag: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar1Point1: string;
  pillar1Point2: string;
  pillar1Point3: string;

  // Pillar 2: Personal Host Care
  pillar2Badge: string;
  pillar2Tag: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar2Point1: string;
  pillar2Point2: string;
  pillar2Point3: string;

  // Pillar 3: Dedicated Season Upgrades
  pillar3Badge: string;
  pillar3Tag: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar3Point1: string;
  pillar3Point2: string;
  pillar3Point3: string;

  // Host Signature Dock
  dockMonogram: string;
  dockQuote: string;
  dockByline: string;
  dockGuarantee: string;
}

export interface AboutSettings {
  hero: AboutHeroSettings;
  story: AboutStorySettings;
  experience: AboutExperienceSettings;
  sanctuary: AboutSanctuarySettings;
  rooftop: AboutRooftopSettings;
  values: AboutValuesSettings;
}"""

assert interface_target in content, "interface_target not found"
content = content.replace(interface_target, interface_replacement, 1)

# 3. Add values to DEFAULT_ABOUT_SETTINGS
default_target = """    sunsetDockNote: "Weligama's premier sunset vista. Resident priority seating.",
    sunsetDockTime: "5PM - 9:30PM",
  }
};"""

default_replacement = """    sunsetDockNote: "Weligama's premier sunset vista. Resident priority seating.",
    sunsetDockTime: "5PM - 9:30PM",
  },
  values: {
    badge: "Our Founding Identity",
    headingLead: "Rooted in Weligama,",
    headingHighlight: "Driven by Family Values",
    subtitle: "More than a boutique hotel, Ocean Air is our family home shared with travelers worldwide. We combine authentic Southern Sri Lankan warmth with 5-star hospitality standards.",

    // Pillar 1: Pure Local Roots
    pillar1Badge: "Pure Local Roots",
    pillar1Tag: "INDEPENDENT HERITAGE",
    pillar1Title: "100% Locally Owned & Run",
    pillar1Desc: "Proudly independent and family-operated. Every booking directly supports Weligama families, local fishermen, surf instructors, and the sustainable vitality of our coastal community.",
    pillar1Point1: "100% Sri Lankan family-owned & operated",
    pillar1Point2: "Local team hiring with fair living wages",
    pillar1Point3: "Direct reinvestment into Weligama village",

    // Pillar 2: Personal Host Care
    pillar2Badge: "Personal Host Care",
    pillar2Tag: "SOUTHERN HOSPITALITY",
    pillar2Title: "Warm Family Atmosphere",
    pillar2Desc: "You are never just a room number here. Our family is on-site daily to share authentic homemade breakfast tips, hidden surf breaks, and heartfelt care from check-in to farewell.",
    pillar2Point1: "Genuine hosts living on-site 24/7",
    pillar2Point2: "Insider guidance for secret uncrowded spots",
    pillar2Point3: "True island home-away-from-home feeling",

    // Pillar 3: Dedicated Season Upgrades
    pillar3Badge: "Yearly Refinements",
    pillar3Tag: "UNCOMPROMISING COMFORT",
    pillar3Title: "Dedicated Season Upgrades",
    pillar3Desc: "We continuously reinvest each season into high-pressure rain showers, whisper-quiet air conditioning, luxury orthopedic bedding, and fast fiber Wi-Fi across all spaces.",
    pillar3Point1: "Annual room comfort & amenity enhancements",
    pillar3Point2: "Whisper-quiet Daikin A/C & rain showers",
    pillar3Point3: "High-speed fiber connectivity in every space",

    // Host Signature Dock
    dockMonogram: "OA",
    dockQuote: "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”",
    dockByline: "The Ocean Air Family • Weligama Bay, Sri Lanka",
    dockGuarantee: "100% Genuine Hospitality",
  }
};"""

assert default_target in content, "default_target not found"
content = content.replace(default_target, default_replacement, 1)

# 4. Add states
states_target = """  const [isAboutSanctuarySavedRecently, setIsAboutSanctuarySavedRecently] = useState(false);
  const [isAboutRooftopSavedRecently, setIsAboutRooftopSavedRecently] = useState(false);
  const [adminActiveRoomTab, setAdminActiveRoomTab] = useState<"basic" | "deluxe">("basic");
  const [previewActiveRoomTab, setPreviewActiveRoomTab] = useState<"basic" | "deluxe">("basic");
  const [adminActiveAtmosphereTab, setAdminActiveAtmosphereTab] = useState<"morning" | "sunset">("morning");
  const [previewActiveAtmosphereTab, setPreviewActiveAtmosphereTab] = useState<"morning" | "sunset">("morning");
  const [isUploadingBasicRoomImg, setIsUploadingBasicRoomImg] = useState(false);
  const [isUploadingDeluxeRoomImg, setIsUploadingDeluxeRoomImg] = useState(false);
  const [isUploadingMorningImg, setIsUploadingMorningImg] = useState(false);
  const [isUploadingSunsetImg, setIsUploadingSunsetImg] = useState(false);"""

states_replacement = """  const [isAboutSanctuarySavedRecently, setIsAboutSanctuarySavedRecently] = useState(false);
  const [isAboutRooftopSavedRecently, setIsAboutRooftopSavedRecently] = useState(false);
  const [isAboutValuesSavedRecently, setIsAboutValuesSavedRecently] = useState(false);
  const [adminActiveRoomTab, setAdminActiveRoomTab] = useState<"basic" | "deluxe">("basic");
  const [previewActiveRoomTab, setPreviewActiveRoomTab] = useState<"basic" | "deluxe">("basic");
  const [adminActiveAtmosphereTab, setAdminActiveAtmosphereTab] = useState<"morning" | "sunset">("morning");
  const [previewActiveAtmosphereTab, setPreviewActiveAtmosphereTab] = useState<"morning" | "sunset">("morning");
  const [adminActivePillarTab, setAdminActivePillarTab] = useState<number>(1);
  const [isUploadingBasicRoomImg, setIsUploadingBasicRoomImg] = useState(false);
  const [isUploadingDeluxeRoomImg, setIsUploadingDeluxeRoomImg] = useState(false);
  const [isUploadingMorningImg, setIsUploadingMorningImg] = useState(false);
  const [isUploadingSunsetImg, setIsUploadingSunsetImg] = useState(false);"""

assert states_target in content, "states_target not found"
content = content.replace(states_target, states_replacement, 1)

# 5. Add values to useEffect sync
useeffect_target = """          sunsetDockNote: val.rooftop?.sunsetDockNote ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetDockNote,
          sunsetDockTime: val.rooftop?.sunsetDockTime ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetDockTime,
        }
      });
    }
  }, [aboutSettingData]);"""

useeffect_replacement = """          sunsetDockNote: val.rooftop?.sunsetDockNote ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetDockNote,
          sunsetDockTime: val.rooftop?.sunsetDockTime ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetDockTime,
        },
        values: {
          badge: val.values?.badge ?? DEFAULT_ABOUT_SETTINGS.values.badge,
          headingLead: val.values?.headingLead ?? DEFAULT_ABOUT_SETTINGS.values.headingLead,
          headingHighlight: val.values?.headingHighlight ?? DEFAULT_ABOUT_SETTINGS.values.headingHighlight,
          subtitle: val.values?.subtitle ?? DEFAULT_ABOUT_SETTINGS.values.subtitle,
          pillar1Badge: val.values?.pillar1Badge ?? DEFAULT_ABOUT_SETTINGS.values.pillar1Badge,
          pillar1Tag: val.values?.pillar1Tag ?? DEFAULT_ABOUT_SETTINGS.values.pillar1Tag,
          pillar1Title: val.values?.pillar1Title ?? DEFAULT_ABOUT_SETTINGS.values.pillar1Title,
          pillar1Desc: val.values?.pillar1Desc ?? DEFAULT_ABOUT_SETTINGS.values.pillar1Desc,
          pillar1Point1: val.values?.pillar1Point1 ?? DEFAULT_ABOUT_SETTINGS.values.pillar1Point1,
          pillar1Point2: val.values?.pillar1Point2 ?? DEFAULT_ABOUT_SETTINGS.values.pillar1Point2,
          pillar1Point3: val.values?.pillar1Point3 ?? DEFAULT_ABOUT_SETTINGS.values.pillar1Point3,
          pillar2Badge: val.values?.pillar2Badge ?? DEFAULT_ABOUT_SETTINGS.values.pillar2Badge,
          pillar2Tag: val.values?.pillar2Tag ?? DEFAULT_ABOUT_SETTINGS.values.pillar2Tag,
          pillar2Title: val.values?.pillar2Title ?? DEFAULT_ABOUT_SETTINGS.values.pillar2Title,
          pillar2Desc: val.values?.pillar2Desc ?? DEFAULT_ABOUT_SETTINGS.values.pillar2Desc,
          pillar2Point1: val.values?.pillar2Point1 ?? DEFAULT_ABOUT_SETTINGS.values.pillar2Point1,
          pillar2Point2: val.values?.pillar2Point2 ?? DEFAULT_ABOUT_SETTINGS.values.pillar2Point2,
          pillar2Point3: val.values?.pillar2Point3 ?? DEFAULT_ABOUT_SETTINGS.values.pillar2Point3,
          pillar3Badge: val.values?.pillar3Badge ?? DEFAULT_ABOUT_SETTINGS.values.pillar3Badge,
          pillar3Tag: val.values?.pillar3Tag ?? DEFAULT_ABOUT_SETTINGS.values.pillar3Tag,
          pillar3Title: val.values?.pillar3Title ?? DEFAULT_ABOUT_SETTINGS.values.pillar3Title,
          pillar3Desc: val.values?.pillar3Desc ?? DEFAULT_ABOUT_SETTINGS.values.pillar3Desc,
          pillar3Point1: val.values?.pillar3Point1 ?? DEFAULT_ABOUT_SETTINGS.values.pillar3Point1,
          pillar3Point2: val.values?.pillar3Point2 ?? DEFAULT_ABOUT_SETTINGS.values.pillar3Point2,
          pillar3Point3: val.values?.pillar3Point3 ?? DEFAULT_ABOUT_SETTINGS.values.pillar3Point3,
          dockMonogram: val.values?.dockMonogram ?? DEFAULT_ABOUT_SETTINGS.values.dockMonogram,
          dockQuote: val.values?.dockQuote ?? DEFAULT_ABOUT_SETTINGS.values.dockQuote,
          dockByline: val.values?.dockByline ?? DEFAULT_ABOUT_SETTINGS.values.dockByline,
          dockGuarantee: val.values?.dockGuarantee ?? DEFAULT_ABOUT_SETTINGS.values.dockGuarantee,
        }
      });
    }
  }, [aboutSettingData]);"""

assert useeffect_target in content, "useeffect_target not found"
content = content.replace(useeffect_target, useeffect_replacement, 1)

# 6. Add reset handler for values
reset_target = """  const handleUploadSunsetImage = async (file: File) => {
    setIsUploadingSunsetImg(true);
    try {
      const res = await uploadMedia(file);
      if (res && res.url) {
        setAboutForm((prev) => ({
          ...prev,
          rooftop: { ...prev.rooftop, sunsetImageUrl: res.url },
        }));
        toast({
          title: "Image Uploaded",
          description: "Golden Hour photo uploaded successfully.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload golden hour image",
        variant: "destructive",
      });
    } finally {
      setIsUploadingSunsetImg(false);
    }
  };"""

reset_replacement = """  const handleUploadSunsetImage = async (file: File) => {
    setIsUploadingSunsetImg(true);
    try {
      const res = await uploadMedia(file);
      if (res && res.url) {
        setAboutForm((prev) => ({
          ...prev,
          rooftop: { ...prev.rooftop, sunsetImageUrl: res.url },
        }));
        toast({
          title: "Image Uploaded",
          description: "Golden Hour photo uploaded successfully.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload golden hour image",
        variant: "destructive",
      });
    } finally {
      setIsUploadingSunsetImg(false);
    }
  };

  const handleResetAboutValuesDefaults = () => {
    setAboutForm((prev) => ({
      ...prev,
      values: DEFAULT_ABOUT_SETTINGS.values,
    }));
    toast({
      title: "Reset to Heritage Values Defaults",
      description: "Default pillars, family host quote, and checklist points restored in form. Click 'Save' to apply.",
    });
  };"""

assert reset_target in content, "reset_target not found"
content = content.replace(reset_target, reset_replacement, 1)

# 7. Add values to handleSaveAboutSettings
save_target = """        sunsetDockNote: aboutForm.rooftop.sunsetDockNote.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetDockNote,
        sunsetDockTime: aboutForm.rooftop.sunsetDockTime.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetDockTime,
      }
    };

    updateSetting.mutate(
      {
        key: "about_settings",
        data: {
          value: updatedPayload,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "🌟 About Settings Saved!",
            description: "Story hero, narrative editorial, experiences, rooms, and rooftop café updated on the live About page.",
          });
          setIsAboutSavedRecently(true);
          setIsAboutStorySavedRecently(true);
          setIsAboutExperienceSavedRecently(true);
          setIsAboutSanctuarySavedRecently(true);
          setIsAboutRooftopSavedRecently(true);
          setTimeout(() => {
            setIsAboutSavedRecently(false);
            setIsAboutStorySavedRecently(false);
            setIsAboutExperienceSavedRecently(false);
            setIsAboutSanctuarySavedRecently(false);
            setIsAboutRooftopSavedRecently(false);
          }, 3000);"""

save_replacement = """        sunsetDockNote: aboutForm.rooftop.sunsetDockNote.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetDockNote,
        sunsetDockTime: aboutForm.rooftop.sunsetDockTime.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetDockTime,
      },
      values: {
        badge: aboutForm.values.badge.trim() || DEFAULT_ABOUT_SETTINGS.values.badge,
        headingLead: aboutForm.values.headingLead.trim() || DEFAULT_ABOUT_SETTINGS.values.headingLead,
        headingHighlight: aboutForm.values.headingHighlight.trim() || DEFAULT_ABOUT_SETTINGS.values.headingHighlight,
        subtitle: aboutForm.values.subtitle.trim() || DEFAULT_ABOUT_SETTINGS.values.subtitle,
        pillar1Badge: aboutForm.values.pillar1Badge.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar1Badge,
        pillar1Tag: aboutForm.values.pillar1Tag.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar1Tag,
        pillar1Title: aboutForm.values.pillar1Title.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar1Title,
        pillar1Desc: aboutForm.values.pillar1Desc.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar1Desc,
        pillar1Point1: aboutForm.values.pillar1Point1.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar1Point1,
        pillar1Point2: aboutForm.values.pillar1Point2.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar1Point2,
        pillar1Point3: aboutForm.values.pillar1Point3.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar1Point3,
        pillar2Badge: aboutForm.values.pillar2Badge.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar2Badge,
        pillar2Tag: aboutForm.values.pillar2Tag.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar2Tag,
        pillar2Title: aboutForm.values.pillar2Title.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar2Title,
        pillar2Desc: aboutForm.values.pillar2Desc.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar2Desc,
        pillar2Point1: aboutForm.values.pillar2Point1.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar2Point1,
        pillar2Point2: aboutForm.values.pillar2Point2.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar2Point2,
        pillar2Point3: aboutForm.values.pillar2Point3.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar2Point3,
        pillar3Badge: aboutForm.values.pillar3Badge.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar3Badge,
        pillar3Tag: aboutForm.values.pillar3Tag.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar3Tag,
        pillar3Title: aboutForm.values.pillar3Title.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar3Title,
        pillar3Desc: aboutForm.values.pillar3Desc.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar3Desc,
        pillar3Point1: aboutForm.values.pillar3Point1.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar3Point1,
        pillar3Point2: aboutForm.values.pillar3Point2.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar3Point2,
        pillar3Point3: aboutForm.values.pillar3Point3.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar3Point3,
        dockMonogram: aboutForm.values.dockMonogram.trim() || DEFAULT_ABOUT_SETTINGS.values.dockMonogram,
        dockQuote: aboutForm.values.dockQuote.trim() || DEFAULT_ABOUT_SETTINGS.values.dockQuote,
        dockByline: aboutForm.values.dockByline.trim() || DEFAULT_ABOUT_SETTINGS.values.dockByline,
        dockGuarantee: aboutForm.values.dockGuarantee.trim() || DEFAULT_ABOUT_SETTINGS.values.dockGuarantee,
      }
    };

    updateSetting.mutate(
      {
        key: "about_settings",
        data: {
          value: updatedPayload,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "🌟 About Settings Saved!",
            description: "Story hero, editorial, experiences, rooms, rooftop café, and family values updated on the live About page.",
          });
          setIsAboutSavedRecently(true);
          setIsAboutStorySavedRecently(true);
          setIsAboutExperienceSavedRecently(true);
          setIsAboutSanctuarySavedRecently(true);
          setIsAboutRooftopSavedRecently(true);
          setIsAboutValuesSavedRecently(true);
          setTimeout(() => {
            setIsAboutSavedRecently(false);
            setIsAboutStorySavedRecently(false);
            setIsAboutExperienceSavedRecently(false);
            setIsAboutSanctuarySavedRecently(false);
            setIsAboutRooftopSavedRecently(false);
            setIsAboutValuesSavedRecently(false);
          }, 3000);"""

assert save_target in content, "save_target not found"
content = content.replace(save_target, save_replacement, 1)

with open(SETTINGS_FILE, "w") as f:
    f.write(content)

print("Settings logic for values updated successfully!")
