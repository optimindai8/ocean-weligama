with open("Ocean-Weligama/scripts/seed_about_settings.mjs", "r") as f:
    content = f.read()

target = """    // Host Signature Dock
    dockMonogram: "OA",
    dockQuote: "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”",
    dockByline: "The Ocean Air Family • Weligama Bay, Sri Lanka",
    dockGuarantee: "100% Genuine Hospitality",
  };

  const updatedValue = {"""

replacement = """    // Host Signature Dock
    dockMonogram: "OA",
    dockQuote: "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”",
    dockByline: "The Ocean Air Family • Weligama Bay, Sri Lanka",
    dockGuarantee: "100% Genuine Hospitality",
  };

  const defaultAboutSignature = {
    monogram: "OA",
    quote: "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”",
    byline: "The Ocean Air Family • Weligama Bay, Sri Lanka",
    guarantee: "100% Genuine Hospitality",
    badge: "Resident Family Pledge",
    note: "We welcome every guest as personal family from the moment you step foot on our golden sand.",
  };

  const updatedValue = {"""

content = content.replace(target, replacement, 1)

target2 = """    values: {
      ...defaultAboutValues,
      ...(currentValue.values || {}),
    }
  };"""

replacement2 = """    values: {
      ...defaultAboutValues,
      ...(currentValue.values || {}),
    },
    signature: {
      ...defaultAboutSignature,
      ...(currentValue.signature || {}),
    }
  };"""

content = content.replace(target2, replacement2, 1)

target3 = 'console.log("Successfully seeded about_settings (hero + story + experience + sanctuary + rooftop + values) in PostgreSQL site_settings!");'
replacement3 = 'console.log("Successfully seeded about_settings (hero + story + experience + sanctuary + rooftop + values + signature) in PostgreSQL site_settings!");'

content = content.replace(target3, replacement3, 1)

with open("Ocean-Weligama/scripts/seed_about_settings.mjs", "w") as f:
    f.write(content)

print("Updated seed_about_settings.mjs with signature successfully!")
