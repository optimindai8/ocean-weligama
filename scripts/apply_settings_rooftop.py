import sys

SETTINGS_FILE = "Ocean-Weligama/artifacts/ocean-weligama/src/pages/admin/settings.tsx"

with open(SETTINGS_FILE, "r") as f:
    content = f.read()

# 1. Add AboutRooftopSettings interface and update AboutSettings
interface_target = """export interface AboutSanctuarySettings {
  badge: string;
  headingLead: string;
  headingHighlight: string;
  tab1Label: string;
  tab2Label: string;

  // Basic Private Room
  basicEyebrow: string;
  basicTitle: string;
  basicDescription: string;
  basicPerk1: string;
  basicPerk2: string;
  basicPerk3: string;
  basicPerk4: string;
  basicCtaText: string;
  basicGuaranteeText: string;
  basicImageUrl: string;
  basicImageBadge: string;

  // Deluxe Double (Ocean View)
  deluxeEyebrow: string;
  deluxeTitle: string;
  deluxeDescription: string;
  deluxePerk1: string;
  deluxePerk2: string;
  deluxePerk3: string;
  deluxePerk4: string;
  deluxeCtaText: string;
  deluxeGuaranteeText: string;
  deluxeImageUrl: string;
  deluxeImageBadge: string;
}

export interface AboutSettings {
  hero: AboutHeroSettings;
  story: AboutStorySettings;
  experience: AboutExperienceSettings;
  sanctuary: AboutSanctuarySettings;
}"""

interface_replacement = """export interface AboutSanctuarySettings {
  badge: string;
  headingLead: string;
  headingHighlight: string;
  tab1Label: string;
  tab2Label: string;

  // Basic Private Room
  basicEyebrow: string;
  basicTitle: string;
  basicDescription: string;
  basicPerk1: string;
  basicPerk2: string;
  basicPerk3: string;
  basicPerk4: string;
  basicCtaText: string;
  basicGuaranteeText: string;
  basicImageUrl: string;
  basicImageBadge: string;

  // Deluxe Double (Ocean View)
  deluxeEyebrow: string;
  deluxeTitle: string;
  deluxeDescription: string;
  deluxePerk1: string;
  deluxePerk2: string;
  deluxePerk3: string;
  deluxePerk4: string;
  deluxeCtaText: string;
  deluxeGuaranteeText: string;
  deluxeImageUrl: string;
  deluxeImageBadge: string;
}

export interface AboutRooftopSettings {
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

assert interface_target in content, "interface_target not found"
content = content.replace(interface_target, interface_replacement, 1)

# 2. Add rooftop to DEFAULT_ABOUT_SETTINGS
default_target = """    deluxeGuaranteeText: "Top-floor ocean horizon view",
    deluxeImageUrl: "/Deluxe_Double%20with_Balcony.jpeg",
    deluxeImageBadge: "Ocean Horizon • Private Balcony Terrace",
  }
};"""

default_replacement = """    deluxeGuaranteeText: "Top-floor ocean horizon view",
    deluxeImageUrl: "/Deluxe_Double%20with_Balcony.jpeg",
    deluxeImageBadge: "Ocean Horizon • Private Balcony Terrace",
  },
  rooftop: {
    headingLead: "The Rooftop Café",
    tab1Label: "Morning Vibes",
    tab2Label: "Golden Hour",

    // Morning Mode
    morningBadge: "Scenic Culinary Rooftop",
    morningHeadingHighlight: "• Sunrise Roasts & Vistas",
    morningSubtitle: "Wake up to freshly roasted Sri Lankan highland espresso, tropical smoothie bowls, and crisp morning offshore breezes. Check the morning surf sets rolling into Weligama Bay before paddling out into the waves.",
    morningCard1Tag: "7:00 AM – 11:30 AM",
    morningCard1Title: "Artisan Roasts & Bowls",
    morningCard1Desc: "Fresh single-origin Ceylon espresso, pour-overs, and organic tropical smoothie bowls crafted to fuel your surf morning.",
    morningCard2Tag: "180° Panoramic Vantage",
    morningCard2Title: "Dawn Surf Conditions",
    morningCard2Desc: "Check Weligama Bay wave sets and wind conditions from the highest terrace vantage while enjoying your morning brew.",
    morningPerk1: "Organic local ingredients",
    morningPerk2: "High-speed terrace Wi-Fi",
    morningImageUrl: "/morning-vibe.png",
    morningImageTag: "Morning Sunrise Service",
    morningDockNote: "Complimentary breakfast & espresso for resident bookings.",
    morningDockTime: "7AM - 11:30AM",

    // Sunset / Golden Hour Mode
    sunsetBadge: "Sunset Horizon Deck",
    sunsetHeadingHighlight: "• Golden Hour Rhythms",
    sunsetSubtitle: "As the sun dips below the Indian Ocean horizon, our rooftop transforms into Weligama's premier vantage point. Sip artisanal island cocktails, catch the golden swell glow, and soak in mellow ambient tunes.",
    sunsetCard1Tag: "5:00 PM – 9:30 PM",
    sunsetCard1Title: "Craft Sun-Downers",
    sunsetCard1Desc: "Signature island-infused mocktails, fresh coconut elixirs, and tapas paired with ambient dusk beats.",
    sunsetCard2Tag: "360° Sunset Horizon",
    sunsetCard2Title: "Golden Hour Ocean Vista",
    sunsetCard2Desc: "Watch the southern sky ignite in vivid shades of amber and magenta with unhindered views straight over the bay.",
    sunsetPerk1: "Ambient dusk acoustics",
    sunsetPerk2: "Resident VIP seating",
    sunsetImageUrl: "/gallery-sunset.png",
    sunsetImageTag: "Golden Hour Vista Deck",
    sunsetDockNote: "Weligama's premier sunset vista. Resident priority seating.",
    sunsetDockTime: "5PM - 9:30PM",
  }
};"""

assert default_target in content, "default_target not found"
content = content.replace(default_target, default_replacement, 1)

# 3. Add states
states_target = """  const [isAboutSanctuarySavedRecently, setIsAboutSanctuarySavedRecently] = useState(false);
  const [adminActiveRoomTab, setAdminActiveRoomTab] = useState<"basic" | "deluxe">("basic");
  const [previewActiveRoomTab, setPreviewActiveRoomTab] = useState<"basic" | "deluxe">("basic");
  const [isUploadingBasicRoomImg, setIsUploadingBasicRoomImg] = useState(false);
  const [isUploadingDeluxeRoomImg, setIsUploadingDeluxeRoomImg] = useState(false);"""

states_replacement = """  const [isAboutSanctuarySavedRecently, setIsAboutSanctuarySavedRecently] = useState(false);
  const [isAboutRooftopSavedRecently, setIsAboutRooftopSavedRecently] = useState(false);
  const [adminActiveRoomTab, setAdminActiveRoomTab] = useState<"basic" | "deluxe">("basic");
  const [previewActiveRoomTab, setPreviewActiveRoomTab] = useState<"basic" | "deluxe">("basic");
  const [adminActiveAtmosphereTab, setAdminActiveAtmosphereTab] = useState<"morning" | "sunset">("morning");
  const [previewActiveAtmosphereTab, setPreviewActiveAtmosphereTab] = useState<"morning" | "sunset">("morning");
  const [isUploadingBasicRoomImg, setIsUploadingBasicRoomImg] = useState(false);
  const [isUploadingDeluxeRoomImg, setIsUploadingDeluxeRoomImg] = useState(false);
  const [isUploadingMorningImg, setIsUploadingMorningImg] = useState(false);
  const [isUploadingSunsetImg, setIsUploadingSunsetImg] = useState(false);"""

assert states_target in content, "states_target not found"
content = content.replace(states_target, states_replacement, 1)

# 4. Add rooftop to useEffect sync
useeffect_target = """          deluxeGuaranteeText: val.sanctuary?.deluxeGuaranteeText ?? DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeGuaranteeText,
          deluxeImageUrl: val.sanctuary?.deluxeImageUrl ?? DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeImageUrl,
          deluxeImageBadge: val.sanctuary?.deluxeImageBadge ?? DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeImageBadge,
        }
      });
    }
  }, [aboutSettingData]);"""

useeffect_replacement = """          deluxeGuaranteeText: val.sanctuary?.deluxeGuaranteeText ?? DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeGuaranteeText,
          deluxeImageUrl: val.sanctuary?.deluxeImageUrl ?? DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeImageUrl,
          deluxeImageBadge: val.sanctuary?.deluxeImageBadge ?? DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeImageBadge,
        },
        rooftop: {
          headingLead: val.rooftop?.headingLead ?? DEFAULT_ABOUT_SETTINGS.rooftop.headingLead,
          tab1Label: val.rooftop?.tab1Label ?? DEFAULT_ABOUT_SETTINGS.rooftop.tab1Label,
          tab2Label: val.rooftop?.tab2Label ?? DEFAULT_ABOUT_SETTINGS.rooftop.tab2Label,
          morningBadge: val.rooftop?.morningBadge ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningBadge,
          morningHeadingHighlight: val.rooftop?.morningHeadingHighlight ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningHeadingHighlight,
          morningSubtitle: val.rooftop?.morningSubtitle ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningSubtitle,
          morningCard1Tag: val.rooftop?.morningCard1Tag ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningCard1Tag,
          morningCard1Title: val.rooftop?.morningCard1Title ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningCard1Title,
          morningCard1Desc: val.rooftop?.morningCard1Desc ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningCard1Desc,
          morningCard2Tag: val.rooftop?.morningCard2Tag ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningCard2Tag,
          morningCard2Title: val.rooftop?.morningCard2Title ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningCard2Title,
          morningCard2Desc: val.rooftop?.morningCard2Desc ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningCard2Desc,
          morningPerk1: val.rooftop?.morningPerk1 ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningPerk1,
          morningPerk2: val.rooftop?.morningPerk2 ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningPerk2,
          morningImageUrl: val.rooftop?.morningImageUrl ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningImageUrl,
          morningImageTag: val.rooftop?.morningImageTag ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningImageTag,
          morningDockNote: val.rooftop?.morningDockNote ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningDockNote,
          morningDockTime: val.rooftop?.morningDockTime ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningDockTime,
          sunsetBadge: val.rooftop?.sunsetBadge ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetBadge,
          sunsetHeadingHighlight: val.rooftop?.sunsetHeadingHighlight ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetHeadingHighlight,
          sunsetSubtitle: val.rooftop?.sunsetSubtitle ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetSubtitle,
          sunsetCard1Tag: val.rooftop?.sunsetCard1Tag ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard1Tag,
          sunsetCard1Title: val.rooftop?.sunsetCard1Title ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard1Title,
          sunsetCard1Desc: val.rooftop?.sunsetCard1Desc ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard1Desc,
          sunsetCard2Tag: val.rooftop?.sunsetCard2Tag ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard2Tag,
          sunsetCard2Title: val.rooftop?.sunsetCard2Title ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard2Title,
          sunsetCard2Desc: val.rooftop?.sunsetCard2Desc ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard2Desc,
          sunsetPerk1: val.rooftop?.sunsetPerk1 ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetPerk1,
          sunsetPerk2: val.rooftop?.sunsetPerk2 ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetPerk2,
          sunsetImageUrl: val.rooftop?.sunsetImageUrl ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetImageUrl,
          sunsetImageTag: val.rooftop?.sunsetImageTag ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetImageTag,
          sunsetDockNote: val.rooftop?.sunsetDockNote ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetDockNote,
          sunsetDockTime: val.rooftop?.sunsetDockTime ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetDockTime,
        }
      });
    }
  }, [aboutSettingData]);"""

assert useeffect_target in content, "useeffect_target not found"
content = content.replace(useeffect_target, useeffect_replacement, 1)

# 5. Add handlers for reset and upload
handlers_target = """  const handleUploadDeluxeRoomImage = async (file: File) => {
    setIsUploadingDeluxeRoomImg(true);
    try {
      const res = await uploadMedia(file);
      if (res && res.url) {
        setAboutForm((prev) => ({
          ...prev,
          sanctuary: { ...prev.sanctuary, deluxeImageUrl: res.url },
        }));
        toast({
          title: "Image Uploaded",
          description: "Deluxe Double Room photo uploaded successfully.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload deluxe room image",
        variant: "destructive",
      });
    } finally {
      setIsUploadingDeluxeRoomImg(false);
    }
  };"""

handlers_replacement = """  const handleUploadDeluxeRoomImage = async (file: File) => {
    setIsUploadingDeluxeRoomImg(true);
    try {
      const res = await uploadMedia(file);
      if (res && res.url) {
        setAboutForm((prev) => ({
          ...prev,
          sanctuary: { ...prev.sanctuary, deluxeImageUrl: res.url },
        }));
        toast({
          title: "Image Uploaded",
          description: "Deluxe Double Room photo uploaded successfully.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload deluxe room image",
        variant: "destructive",
      });
    } finally {
      setIsUploadingDeluxeRoomImg(false);
    }
  };

  const handleResetAboutRooftopDefaults = () => {
    setAboutForm((prev) => ({
      ...prev,
      rooftop: DEFAULT_ABOUT_SETTINGS.rooftop,
    }));
    toast({
      title: "Reset to Rooftop Café Defaults",
      description: "Default roasts, sunset cocktail texts, atmosphere badges, and imagery restored in form. Click 'Save' to apply.",
    });
  };

  const handleUploadMorningImage = async (file: File) => {
    setIsUploadingMorningImg(true);
    try {
      const res = await uploadMedia(file);
      if (res && res.url) {
        setAboutForm((prev) => ({
          ...prev,
          rooftop: { ...prev.rooftop, morningImageUrl: res.url },
        }));
        toast({
          title: "Image Uploaded",
          description: "Morning Vibes photo uploaded successfully.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload morning image",
        variant: "destructive",
      });
    } finally {
      setIsUploadingMorningImg(false);
    }
  };

  const handleUploadSunsetImage = async (file: File) => {
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

assert handlers_target in content, "handlers_target not found"
content = content.replace(handlers_target, handlers_replacement, 1)

# 6. Update handleSaveAboutSettings payload and toast
save_target = """        deluxeCtaText: aboutForm.sanctuary.deluxeCtaText.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeCtaText,
        deluxeGuaranteeText: aboutForm.sanctuary.deluxeGuaranteeText.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeGuaranteeText,
        deluxeImageUrl: aboutForm.sanctuary.deluxeImageUrl.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeImageUrl,
        deluxeImageBadge: aboutForm.sanctuary.deluxeImageBadge.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeImageBadge,
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
            description: "Story hero, narrative editorial, and experience builder updated on the live About page.",
          });
          setIsAboutSavedRecently(true);
          setIsAboutStorySavedRecently(true);
          setIsAboutExperienceSavedRecently(true);
          setIsAboutSanctuarySavedRecently(true);
          setTimeout(() => {
            setIsAboutSavedRecently(false);
            setIsAboutStorySavedRecently(false);
            setIsAboutExperienceSavedRecently(false);
            setIsAboutSanctuarySavedRecently(false);
          }, 3000);"""

save_replacement = """        deluxeCtaText: aboutForm.sanctuary.deluxeCtaText.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeCtaText,
        deluxeGuaranteeText: aboutForm.sanctuary.deluxeGuaranteeText.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeGuaranteeText,
        deluxeImageUrl: aboutForm.sanctuary.deluxeImageUrl.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeImageUrl,
        deluxeImageBadge: aboutForm.sanctuary.deluxeImageBadge.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeImageBadge,
      },
      rooftop: {
        headingLead: aboutForm.rooftop.headingLead.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.headingLead,
        tab1Label: aboutForm.rooftop.tab1Label.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.tab1Label,
        tab2Label: aboutForm.rooftop.tab2Label.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.tab2Label,
        morningBadge: aboutForm.rooftop.morningBadge.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningBadge,
        morningHeadingHighlight: aboutForm.rooftop.morningHeadingHighlight.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningHeadingHighlight,
        morningSubtitle: aboutForm.rooftop.morningSubtitle.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningSubtitle,
        morningCard1Tag: aboutForm.rooftop.morningCard1Tag.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningCard1Tag,
        morningCard1Title: aboutForm.rooftop.morningCard1Title.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningCard1Title,
        morningCard1Desc: aboutForm.rooftop.morningCard1Desc.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningCard1Desc,
        morningCard2Tag: aboutForm.rooftop.morningCard2Tag.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningCard2Tag,
        morningCard2Title: aboutForm.rooftop.morningCard2Title.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningCard2Title,
        morningCard2Desc: aboutForm.rooftop.morningCard2Desc.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningCard2Desc,
        morningPerk1: aboutForm.rooftop.morningPerk1.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningPerk1,
        morningPerk2: aboutForm.rooftop.morningPerk2.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningPerk2,
        morningImageUrl: aboutForm.rooftop.morningImageUrl.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningImageUrl,
        morningImageTag: aboutForm.rooftop.morningImageTag.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningImageTag,
        morningDockNote: aboutForm.rooftop.morningDockNote.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningDockNote,
        morningDockTime: aboutForm.rooftop.morningDockTime.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningDockTime,
        sunsetBadge: aboutForm.rooftop.sunsetBadge.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetBadge,
        sunsetHeadingHighlight: aboutForm.rooftop.sunsetHeadingHighlight.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetHeadingHighlight,
        sunsetSubtitle: aboutForm.rooftop.sunsetSubtitle.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetSubtitle,
        sunsetCard1Tag: aboutForm.rooftop.sunsetCard1Tag.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard1Tag,
        sunsetCard1Title: aboutForm.rooftop.sunsetCard1Title.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard1Title,
        sunsetCard1Desc: aboutForm.rooftop.sunsetCard1Desc.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard1Desc,
        sunsetCard2Tag: aboutForm.rooftop.sunsetCard2Tag.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard2Tag,
        sunsetCard2Title: aboutForm.rooftop.sunsetCard2Title.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard2Title,
        sunsetCard2Desc: aboutForm.rooftop.sunsetCard2Desc.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard2Desc,
        sunsetPerk1: aboutForm.rooftop.sunsetPerk1.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetPerk1,
        sunsetPerk2: aboutForm.rooftop.sunsetPerk2.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetPerk2,
        sunsetImageUrl: aboutForm.rooftop.sunsetImageUrl.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetImageUrl,
        sunsetImageTag: aboutForm.rooftop.sunsetImageTag.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetImageTag,
        sunsetDockNote: aboutForm.rooftop.sunsetDockNote.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetDockNote,
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

assert save_target in content, "save_target not found"
content = content.replace(save_target, save_replacement, 1)

with open(SETTINGS_FILE, "w") as f:
    f.write(content)

print("Settings logic updated successfully!")
