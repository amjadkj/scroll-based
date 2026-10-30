export interface ChapterData {
  id: string;
  index: number;
  timeStart: number; // in seconds (0 - 30)
  timeEnd: number;
  scrollStart: number; // in % (0 - 100)
  scrollEnd: number;
  placement: "bottom-left" | "top-left" | "top-right" | "bottom-right" | "center-left";
  label: string;
  headline: string;
  body: string;
  stat?: {
    value: string;
    caption?: string;
  };
  details?: string[];
  cta?: {
    primaryText: string;
    secondaryText: string;
  };
}

export const CHAPTERS: ChapterData[] = [
  {
    id: "hero",
    index: 0,
    timeStart: 0.0,
    timeEnd: 2.0,
    scrollStart: 0,
    scrollEnd: 6.7,
    placement: "bottom-left",
    label: "ARBORIS INDUSTRIAL TIMBER",
    headline: "From forest to finished panel.",
    body: "Scroll to follow a single sustainable hardwood log through our precision manufacturing facility. 30 seconds of high-calibrated production.",
    details: ["100% Plantation Grown", "Continuous Tracking Shot", "Architectural Grade BWP"],
  },
  {
    id: "debarking",
    index: 1,
    timeStart: 2.0,
    timeEnd: 4.5,
    scrollStart: 6.7,
    scrollEnd: 15.0,
    placement: "top-left",
    label: "01 / Log Selection & Debarking",
    headline: "Every panel starts as a chosen log.",
    body: "Logs are ultrasonic-tested for core density and straightness, then mechanically stripped of bark in high-speed rotary drums so only virgin cambium moves forward.",
    stat: {
      value: "100% Certified",
      caption: "FSC & PEFC certified sustainable plantations",
    },
    details: ["Laser diameter grading", "Zero-grit rotary debarking", "Bark recycled for biomass boiler"],
  },
  {
    id: "peeling",
    index: 2,
    timeStart: 4.5,
    timeEnd: 8.0,
    scrollStart: 15.0,
    scrollEnd: 26.7,
    placement: "bottom-left",
    label: "02 / Peeling",
    headline: "One log. One unbroken ribbon.",
    body: "A heavy-duty hydraulic spindle lathe rotates the steamed timber billet against a micro-honed steel alloy knife, unrolling a continuous veneer sheet thinner than a coin.",
    stat: {
      value: "1.5 mm",
      caption: "Continuous veneer thickness (±0.04 mm tolerance)",
    },
    details: ["High-torque servo spindle", "Precision nose-bar pressure", "Hydraulic core ejection at 60 mm"],
  },
  {
    id: "clipping",
    index: 3,
    timeStart: 8.0,
    timeEnd: 10.5,
    scrollStart: 26.7,
    scrollEnd: 35.0,
    placement: "top-right",
    label: "03 / Clipping & Sorting",
    headline: "Cut to size. Graded by eye and infrared scanner.",
    body: "High-speed pneumatic rotary clippers sever the green veneer ribbon into standard formats while optical matrix sensors detect knots and splits at millisecond velocity.",
    stat: {
      value: "0.02s",
      caption: "Real-time AI defect detection & ejection",
    },
    details: ["2,440 × 1,220 mm standard cut", "Moisture-density sorting", "Automated vacuum sheet stacking"],
  },
  {
    id: "drying",
    index: 4,
    timeStart: 10.5,
    timeEnd: 14.0,
    scrollStart: 35.0,
    scrollEnd: 46.7,
    placement: "bottom-left",
    label: "04 / Drying",
    headline: "Moisture down. Structural strength up.",
    body: "Green veneer ribbons journey through a four-deck steam jet-box dryer. Uniform internal evaporation prevents tensile distortion, ensuring lifelong flatness in finished boards.",
    stat: {
      value: "8.5%",
      caption: "Uniform moisture content target (±1.0%)",
    },
    details: ["Multi-zone thermal control (160°C)", "Inline capacitance moisture sensors", "Thermal stress relief chambers"],
  },
  {
    id: "gluing",
    index: 5,
    timeStart: 14.0,
    timeEnd: 17.0,
    scrollStart: 46.7,
    scrollEnd: 56.7,
    placement: "top-right",
    label: "05 / Glue Spreading",
    headline: "The molecular bond that holds it together.",
    body: "Precision-grooved rubber rollers apply an exact grammage of structural Phenol-Formaldehyde resin to core veneers. Too little weakens adhesion; too much causes delamination.",
    stat: {
      value: "IS:710 BWP",
      caption: "Boiling Water Proof marine grade synthetic resin",
    },
    details: ["320 g/m² calibrated adhesive spread", "72-hour boiling water immersion certified", "Microbial & termite repellent matrix"],
  },
  {
    id: "layup",
    index: 6,
    timeStart: 17.0,
    timeEnd: 19.5,
    scrollStart: 56.7,
    scrollEnd: 65.0,
    placement: "top-left",
    label: "06 / Layup",
    headline: "Layers laid at right angles.",
    body: "Robotic gantry arms stack alternate core veneers rotated exactly 90 degrees. This cross-laminated grain architecture equalizes dimensional stresses and creates shear resistance.",
    stat: {
      value: "11-Ply",
      caption: "Orthogonal balanced core configuration (18mm)",
    },
    details: ["Symmetrical face-to-back balance", "Zero core-gap pneumatic alignment", "Zero internal overlap tolerance"],
  },
  {
    id: "pressing",
    index: 7,
    timeStart: 19.5,
    timeEnd: 23.0,
    scrollStart: 65.0,
    scrollEnd: 76.7,
    placement: "bottom-left",
    label: "07 / Hot Pressing",
    headline: "Heat and pressure. Seconds become permanent.",
    body: "Multi-daylight hydraulic platen presses compress stacked assemblies under massive force at 145°C. The thermosetting resin polymerizes into an irreversible monolithic timber bond.",
    stat: {
      value: "1,850 tonnes",
      caption: "Hydraulic platen compression force",
    },
    details: ["145°C heated thermal oil platens", "Breathing cycle gas decompression", "Permanent chemical polymerization"],
  },
  {
    id: "sanding",
    index: 8,
    timeStart: 23.0,
    timeEnd: 27.0,
    scrollStart: 76.7,
    scrollEnd: 90.0,
    placement: "top-right",
    label: "08 / Trimming & Sanding",
    headline: "Square edges. Mirror-smooth calibrated faces.",
    body: "Diamond-tipped double-end tenoners trim boards to exact 90° squareness. Next, computer-calibrated wide-belt sanders with graded grits bring surfaces to architectural perfection.",
    stat: {
      value: "± 0.2 mm",
      caption: "Thickness tolerance across entire board",
    },
    details: ["180 & 240-grit multi-head sanders", "Laser squareness inspection", "Ultrasound void scan verification"],
  },
  {
    id: "finished",
    index: 9,
    timeStart: 27.0,
    timeEnd: 30.0,
    scrollStart: 90.0,
    scrollEnd: 100.0,
    placement: "center-left",
    label: "09 / Finished Architectural Panels",
    headline: "Ready for your next build.",
    body: "Tested, edge-sealed, and packaged on pallets for commercial architecture, luxury joinery, and marine fabrication worldwide.",
    stat: {
      value: "Zero Voids",
      caption: "Engineered for lifetime acoustic and structural stability",
    },
    details: ["FSC / CARB Phase II / CE certified", "Ready for shipping to 40+ countries", "Custom sheet formats up to 3,600 mm"],
    cta: {
      primaryText: "Request a Quote",
      secondaryText: "Download Technical Catalogue",
    },
  },
];

