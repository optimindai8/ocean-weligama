import sys

SETTINGS_FILE = "Ocean-Weligama/artifacts/ocean-weligama/src/pages/admin/settings.tsx"

with open(SETTINGS_FILE, "r") as f:
    content = f.read()

# 1. Add AboutSignatureSettings, AboutInvitationSettings and update AboutSettings
interface_target = """export interface AboutValuesSettings {
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

interface_replacement = """export interface AboutValuesSettings {
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

export interface AboutSignatureSettings {
  monogram: string;
  quote: string;
  byline: string;
  guarantee: string;
  badge: string;
  note: string;
}

export interface AboutInvitationSettings {
  badge: string;
  headingLead: string;
  headingHighlight: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  perk1: string;
  perk2: string;
  perk3: string;
}

export interface AboutSettings {
  hero: AboutHeroSettings;
  story: AboutStorySettings;
  experience: AboutExperienceSettings;
  sanctuary: AboutSanctuarySettings;
  rooftop: AboutRooftopSettings;
  values: AboutValuesSettings;
  signature: AboutSignatureSettings;
  invitation: AboutInvitationSettings;
}"""

assert interface_target in content, "interface_target not found!"
content = content.replace(interface_target, interface_replacement, 1)

# 2. Add signature & invitation to DEFAULT_ABOUT_SETTINGS
default_target = """    // Host Signature Dock
    dockMonogram: "OA",
    dockQuote: "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”",
    dockByline: "The Ocean Air Family • Weligama Bay, Sri Lanka",
    dockGuarantee: "100% Genuine Hospitality",
  }
};"""

default_replacement = """    // Host Signature Dock
    dockMonogram: "OA",
    dockQuote: "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”",
    dockByline: "The Ocean Air Family • Weligama Bay, Sri Lanka",
    dockGuarantee: "100% Genuine Hospitality",
  },
  signature: {
    monogram: "OA",
    quote: "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”",
    byline: "The Ocean Air Family • Weligama Bay, Sri Lanka",
    guarantee: "100% Genuine Hospitality",
    badge: "Resident Family Pledge",
    note: "We welcome every guest as personal family from the moment you step foot on our golden sand.",
  },
  invitation: {
    badge: "Your Weligama Escape",
    headingLead: "Ready to Discover",
    headingHighlight: "Southern Sri Lanka?",
    subtitle: "Whether catching your first Indian Ocean dawn wave, sipping sunrise artisan roasts, or unwinding under starlit coastal skies—your unforgettable island story begins at Ocean Air.",
    ctaText: "Book Your Experience",
    ctaLink: "/book?new=1",
    perk1: "Best Direct Rates Guaranteed",
    perk2: "Free 3-Min Beach Walk Location",
    perk3: "100% Flexible Booking Options",
  }
};"""

assert default_target in content, "default_target not found!"
content = content.replace(default_target, default_replacement, 1)

# 3. Add states
states_target = """  const [isAboutValuesSavedRecently, setIsAboutValuesSavedRecently] = useState(false);"""
states_replacement = """  const [isAboutValuesSavedRecently, setIsAboutValuesSavedRecently] = useState(false);
  const [isAboutSignatureSavedRecently, setIsAboutSignatureSavedRecently] = useState(false);
  const [isAboutInvitationSavedRecently, setIsAboutInvitationSavedRecently] = useState(false);"""

assert states_target in content, "states_target not found!"
content = content.replace(states_target, states_replacement, 1)

# 4. Add signature & invitation to useEffect sync
useeffect_target = """          dockMonogram: val.values?.dockMonogram ?? DEFAULT_ABOUT_SETTINGS.values.dockMonogram,
          dockQuote: val.values?.dockQuote ?? DEFAULT_ABOUT_SETTINGS.values.dockQuote,
          dockByline: val.values?.dockByline ?? DEFAULT_ABOUT_SETTINGS.values.dockByline,
          dockGuarantee: val.values?.dockGuarantee ?? DEFAULT_ABOUT_SETTINGS.values.dockGuarantee,
        }
      });
    }
  }, [aboutSettingData]);"""

useeffect_replacement = """          dockMonogram: val.values?.dockMonogram ?? DEFAULT_ABOUT_SETTINGS.values.dockMonogram,
          dockQuote: val.values?.dockQuote ?? DEFAULT_ABOUT_SETTINGS.values.dockQuote,
          dockByline: val.values?.dockByline ?? DEFAULT_ABOUT_SETTINGS.values.dockByline,
          dockGuarantee: val.values?.dockGuarantee ?? DEFAULT_ABOUT_SETTINGS.values.dockGuarantee,
        },
        signature: {
          monogram: val.signature?.monogram ?? DEFAULT_ABOUT_SETTINGS.signature.monogram,
          quote: val.signature?.quote ?? DEFAULT_ABOUT_SETTINGS.signature.quote,
          byline: val.signature?.byline ?? DEFAULT_ABOUT_SETTINGS.signature.byline,
          guarantee: val.signature?.guarantee ?? DEFAULT_ABOUT_SETTINGS.signature.guarantee,
          badge: val.signature?.badge ?? DEFAULT_ABOUT_SETTINGS.signature.badge,
          note: val.signature?.note ?? DEFAULT_ABOUT_SETTINGS.signature.note,
        },
        invitation: {
          badge: val.invitation?.badge ?? DEFAULT_ABOUT_SETTINGS.invitation.badge,
          headingLead: val.invitation?.headingLead ?? DEFAULT_ABOUT_SETTINGS.invitation.headingLead,
          headingHighlight: val.invitation?.headingHighlight ?? DEFAULT_ABOUT_SETTINGS.invitation.headingHighlight,
          subtitle: val.invitation?.subtitle ?? DEFAULT_ABOUT_SETTINGS.invitation.subtitle,
          ctaText: val.invitation?.ctaText ?? DEFAULT_ABOUT_SETTINGS.invitation.ctaText,
          ctaLink: val.invitation?.ctaLink ?? DEFAULT_ABOUT_SETTINGS.invitation.ctaLink,
          perk1: val.invitation?.perk1 ?? DEFAULT_ABOUT_SETTINGS.invitation.perk1,
          perk2: val.invitation?.perk2 ?? DEFAULT_ABOUT_SETTINGS.invitation.perk2,
          perk3: val.invitation?.perk3 ?? DEFAULT_ABOUT_SETTINGS.invitation.perk3,
        }
      });
    }
  }, [aboutSettingData]);"""

assert useeffect_target in content, "useeffect_target not found!"
content = content.replace(useeffect_target, useeffect_replacement, 1)

# 5. Add handlers for reset
handler_target = """  const handleResetAboutValuesDefaults = () => {
    setAboutForm((prev) => ({
      ...prev,
      values: DEFAULT_ABOUT_SETTINGS.values,
    }));
    toast({
      title: "Reset to Heritage Values Defaults",
      description: "Default pillars, family host quote, and checklist points restored in form. Click 'Save' to apply.",
    });
  };"""

handler_replacement = """  const handleResetAboutValuesDefaults = () => {
    setAboutForm((prev) => ({
      ...prev,
      values: DEFAULT_ABOUT_SETTINGS.values,
    }));
    toast({
      title: "Reset to Heritage Values Defaults",
      description: "Default pillars, family host quote, and checklist points restored in form. Click 'Save' to apply.",
    });
  };

  const handleResetAboutSignatureDefaults = () => {
    setAboutForm((prev) => ({
      ...prev,
      signature: DEFAULT_ABOUT_SETTINGS.signature,
    }));
    toast({
      title: "Reset to Signature Dock Defaults",
      description: "Default host monogram, quotation, and guarantee restored in form. Click 'Save' to apply.",
    });
  };

  const handleResetAboutInvitationDefaults = () => {
    setAboutForm((prev) => ({
      ...prev,
      invitation: DEFAULT_ABOUT_SETTINGS.invitation,
    }));
    toast({
      title: "Reset to Invitation Defaults",
      description: "Default invitation headline, button label, and perks restored in form. Click 'Save' to apply.",
    });
  };"""

assert handler_target in content, "handler_target not found!"
content = content.replace(handler_target, handler_replacement, 1)

# 6. Add signature & invitation to handleSaveAboutSettings
save_target = """        dockMonogram: aboutForm.values.dockMonogram.trim() || DEFAULT_ABOUT_SETTINGS.values.dockMonogram,
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

save_replacement = """        dockMonogram: aboutForm.values.dockMonogram.trim() || DEFAULT_ABOUT_SETTINGS.values.dockMonogram,
        dockQuote: aboutForm.values.dockQuote.trim() || DEFAULT_ABOUT_SETTINGS.values.dockQuote,
        dockByline: aboutForm.values.dockByline.trim() || DEFAULT_ABOUT_SETTINGS.values.dockByline,
        dockGuarantee: aboutForm.values.dockGuarantee.trim() || DEFAULT_ABOUT_SETTINGS.values.dockGuarantee,
      },
      signature: {
        monogram: aboutForm.signature.monogram.trim() || DEFAULT_ABOUT_SETTINGS.signature.monogram,
        quote: aboutForm.signature.quote.trim() || DEFAULT_ABOUT_SETTINGS.signature.quote,
        byline: aboutForm.signature.byline.trim() || DEFAULT_ABOUT_SETTINGS.signature.byline,
        guarantee: aboutForm.signature.guarantee.trim() || DEFAULT_ABOUT_SETTINGS.signature.guarantee,
        badge: aboutForm.signature.badge.trim() || DEFAULT_ABOUT_SETTINGS.signature.badge,
        note: aboutForm.signature.note.trim() || DEFAULT_ABOUT_SETTINGS.signature.note,
      },
      invitation: {
        badge: aboutForm.invitation.badge.trim() || DEFAULT_ABOUT_SETTINGS.invitation.badge,
        headingLead: aboutForm.invitation.headingLead.trim() || DEFAULT_ABOUT_SETTINGS.invitation.headingLead,
        headingHighlight: aboutForm.invitation.headingHighlight.trim() || DEFAULT_ABOUT_SETTINGS.invitation.headingHighlight,
        subtitle: aboutForm.invitation.subtitle.trim() || DEFAULT_ABOUT_SETTINGS.invitation.subtitle,
        ctaText: aboutForm.invitation.ctaText.trim() || DEFAULT_ABOUT_SETTINGS.invitation.ctaText,
        ctaLink: aboutForm.invitation.ctaLink.trim() || DEFAULT_ABOUT_SETTINGS.invitation.ctaLink,
        perk1: aboutForm.invitation.perk1.trim() || DEFAULT_ABOUT_SETTINGS.invitation.perk1,
        perk2: aboutForm.invitation.perk2.trim() || DEFAULT_ABOUT_SETTINGS.invitation.perk2,
        perk3: aboutForm.invitation.perk3.trim() || DEFAULT_ABOUT_SETTINGS.invitation.perk3,
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
            description: "All About page sections, including Family Host Signature and Final Invitation CTA, updated live.",
          });
          setIsAboutSavedRecently(true);
          setIsAboutStorySavedRecently(true);
          setIsAboutExperienceSavedRecently(true);
          setIsAboutSanctuarySavedRecently(true);
          setIsAboutRooftopSavedRecently(true);
          setIsAboutValuesSavedRecently(true);
          setIsAboutSignatureSavedRecently(true);
          setIsAboutInvitationSavedRecently(true);
          setTimeout(() => {
            setIsAboutSavedRecently(false);
            setIsAboutStorySavedRecently(false);
            setIsAboutExperienceSavedRecently(false);
            setIsAboutSanctuarySavedRecently(false);
            setIsAboutRooftopSavedRecently(false);
            setIsAboutValuesSavedRecently(false);
            setIsAboutSignatureSavedRecently(false);
            setIsAboutInvitationSavedRecently(false);
          }, 3000);"""

assert save_target in content, "save_target not found!"
content = content.replace(save_target, save_replacement, 1)

with open(SETTINGS_FILE, "w") as f:
    f.write(content)

print("Settings logic for signature and invitation updated successfully!")
