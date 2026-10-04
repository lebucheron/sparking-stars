// dist/friend-worlds.json
var friend_worlds_default = {
  version: 1,
  collection: "Rare Friends / Isometric Worlds",
  source: {
    livingMap: "src/friend-world.ts",
    projection: "src/friend-worlds.json#style.projection",
    characterRule: "Use canonical on-chain Generations sprites through the SDK sprite reader. Preserve integer pixel edges and the white outline."
  },
  style: {
    projection: {
      a: 0.8660254038,
      b: 0.28
    },
    ground: {
      width: 576,
      height: 384,
      chunkSize: 48
    },
    viewport: {
      width: 1600,
      height: 1200,
      centerX: 800,
      centerY: 690,
      scale: 1.5
    },
    palette: {
      ink: "#000000",
      paper: "#FFFFFF",
      signal: "#CCFF00"
    },
    spriteSize: 80,
    background: "transparent",
    previewBackground: "#090B09",
    grid: {
      cell: 24,
      strokeWidth: 0.55,
      opacity: 0.18
    },
    edgeStrokeWidth: 1.5,
    loadingRules: {
      void: "Subtract this chunk from the top and floor texture. Show only a subtle dotted guide if needed.",
      wireframe: "Subtract the chunk; show an open green isometric outline with sparse node corners, no fill.",
      floating: "Subtract the chunk; draw a separate white/dither unfinished tile lifted by lift screen pixels with a slim green guide.",
      occlusion: "Mask all floor paths and texture to the actual loaded surface. Do not leave upright actors or props anchored over a missing chunk."
    },
    characterPixelScale: 5,
    characterSourceResolution: [
      16,
      16
    ]
  },
  worlds: [
    {
      family: "garden-oval",
      name: "Garden Commons",
      setting: "Botanical garden",
      shape: "Organic oval",
      summary: "A soft island with a pond, pixel trees and an open gathering route.",
      geometry: {
        polygons: [
          [
            [
              72,
              48
            ],
            [
              144,
              16
            ],
            [
              240,
              0
            ],
            [
              384,
              8
            ],
            [
              480,
              48
            ],
            [
              544,
              104
            ],
            [
              576,
              176
            ],
            [
              560,
              248
            ],
            [
              512,
              312
            ],
            [
              432,
              360
            ],
            [
              304,
              384
            ],
            [
              176,
              376
            ],
            [
              80,
              336
            ],
            [
              24,
              272
            ],
            [
              0,
              192
            ],
            [
              16,
              112
            ]
          ]
        ],
        holes: [],
        depth: 18
      },
      props: [
        {
          type: "tree",
          x: 144,
          y: 90,
          scale: 1.05
        },
        {
          type: "tree",
          x: 452,
          y: 110,
          scale: 1.12
        },
        {
          type: "flower",
          x: 95,
          y: 130,
          scale: 0.8
        },
        {
          type: "flower",
          x: 180,
          y: 100,
          scale: 0.9
        },
        {
          type: "flower",
          x: 351,
          y: 335,
          scale: 0.9
        },
        {
          type: "flower",
          x: 248,
          y: 337,
          scale: 0.8
        },
        {
          type: "bench",
          x: 340,
          y: 58,
          scale: 0.9
        },
        {
          type: "reeds",
          x: 126,
          y: 282,
          scale: 0.85
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 120,
          y: 212
        },
        {
          sprite: 1,
          x: 240,
          y: 94
        },
        {
          sprite: 2,
          x: 344,
          y: 168
        },
        {
          sprite: 3,
          x: 453,
          y: 207
        },
        {
          sprite: 4,
          x: 260,
          y: 294
        },
        {
          sprite: 5,
          x: 380,
          y: 290
        }
      ],
      paths: [
        {
          points: [
            [
              64,
              184
            ],
            [
              184,
              184
            ],
            [
              184,
              144
            ],
            [
              320,
              144
            ],
            [
              320,
              232
            ],
            [
              464,
              232
            ]
          ],
          width: 22
        }
      ],
      patches: [
        {
          x: 89,
          y: 52,
          w: 112,
          h: 64,
          pattern: "dither"
        },
        {
          x: 410,
          y: 54,
          w: 104,
          h: 70,
          pattern: "dither"
        },
        {
          x: 70,
          y: 258,
          w: 128,
          h: 64,
          pattern: "water"
        },
        {
          x: 226,
          y: 310,
          w: 180,
          h: 42,
          pattern: "dither"
        }
      ],
      signals: [
        {
          x: 176,
          y: 164,
          kind: "currency"
        },
        {
          x: 292,
          y: 152,
          kind: "currency"
        },
        {
          x: 402,
          y: 235,
          kind: "currency"
        },
        {
          x: 162,
          y: 247,
          kind: "currency"
        }
      ],
      id: "01-garden-oval-complete",
      variant: "complete",
      missingChunks: []
    },
    {
      family: "garden-oval",
      name: "Garden Commons / Loading",
      setting: "Botanical garden",
      shape: "Organic oval",
      summary: "A soft island with a pond, pixel trees and an open gathering route. An unfinished outer section reveals missing, wireframe and suspended grid chunks.",
      geometry: {
        polygons: [
          [
            [
              72,
              48
            ],
            [
              144,
              16
            ],
            [
              240,
              0
            ],
            [
              384,
              8
            ],
            [
              480,
              48
            ],
            [
              544,
              104
            ],
            [
              576,
              176
            ],
            [
              560,
              248
            ],
            [
              512,
              312
            ],
            [
              432,
              360
            ],
            [
              304,
              384
            ],
            [
              176,
              376
            ],
            [
              80,
              336
            ],
            [
              24,
              272
            ],
            [
              0,
              192
            ],
            [
              16,
              112
            ]
          ]
        ],
        holes: [],
        depth: 18
      },
      props: [
        {
          type: "tree",
          x: 144,
          y: 90,
          scale: 1.05
        },
        {
          type: "tree",
          x: 452,
          y: 110,
          scale: 1.12
        },
        {
          type: "flower",
          x: 95,
          y: 130,
          scale: 0.8
        },
        {
          type: "flower",
          x: 180,
          y: 100,
          scale: 0.9
        },
        {
          type: "flower",
          x: 351,
          y: 335,
          scale: 0.9
        },
        {
          type: "flower",
          x: 248,
          y: 337,
          scale: 0.8
        },
        {
          type: "bench",
          x: 340,
          y: 58,
          scale: 0.9
        },
        {
          type: "reeds",
          x: 126,
          y: 282,
          scale: 0.85
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 120,
          y: 212
        },
        {
          sprite: 1,
          x: 240,
          y: 94
        },
        {
          sprite: 2,
          x: 344,
          y: 168
        },
        {
          sprite: 3,
          x: 453,
          y: 207
        },
        {
          sprite: 4,
          x: 260,
          y: 294
        },
        {
          sprite: 5,
          x: 380,
          y: 290
        }
      ],
      paths: [
        {
          points: [
            [
              64,
              184
            ],
            [
              184,
              184
            ],
            [
              184,
              144
            ],
            [
              320,
              144
            ],
            [
              320,
              232
            ],
            [
              464,
              232
            ]
          ],
          width: 22
        }
      ],
      patches: [
        {
          x: 89,
          y: 52,
          w: 112,
          h: 64,
          pattern: "dither"
        },
        {
          x: 410,
          y: 54,
          w: 104,
          h: 70,
          pattern: "dither"
        },
        {
          x: 70,
          y: 258,
          w: 128,
          h: 64,
          pattern: "water"
        },
        {
          x: 226,
          y: 310,
          w: 180,
          h: 42,
          pattern: "dither"
        }
      ],
      signals: [
        {
          x: 176,
          y: 164,
          kind: "currency"
        },
        {
          x: 292,
          y: 152,
          kind: "currency"
        },
        {
          x: 402,
          y: 235,
          kind: "currency"
        },
        {
          x: 162,
          y: 247,
          kind: "currency"
        }
      ],
      id: "01-garden-oval-loading",
      variant: "loading",
      missingChunks: [
        {
          x: 432,
          y: 240,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 480,
          y: 240,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 528,
          y: 240,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 30
        },
        {
          x: 432,
          y: 288,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 480,
          y: 288,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 384,
          y: 336,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 22
        },
        {
          x: 432,
          y: 336,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        }
      ]
    },
    {
      family: "circuit-courtyard",
      name: "Circuit Courtyard",
      setting: "Industrial circuit workshop",
      shape: "Courtyard ring",
      summary: "A compact workshop wrapped around an open square, with terminals, tanks and circuit traces.",
      geometry: {
        polygons: [
          [
            [
              48,
              0
            ],
            [
              528,
              0
            ],
            [
              576,
              48
            ],
            [
              576,
              336
            ],
            [
              528,
              384
            ],
            [
              48,
              384
            ],
            [
              0,
              336
            ],
            [
              0,
              48
            ]
          ]
        ],
        holes: [
          [
            [
              192,
              120
            ],
            [
              384,
              120
            ],
            [
              384,
              264
            ],
            [
              192,
              264
            ]
          ]
        ],
        depth: 24
      },
      props: [
        {
          type: "tank",
          x: 95,
          y: 74,
          scale: 1.1
        },
        {
          type: "pipe",
          x: 158,
          y: 68,
          scale: 0.95
        },
        {
          type: "terminal",
          x: 426,
          y: 72,
          scale: 1.05
        },
        {
          type: "crate",
          x: 518,
          y: 133,
          scale: 0.95
        },
        {
          type: "tank",
          x: 88,
          y: 286,
          scale: 0.8
        },
        {
          type: "terminal",
          x: 448,
          y: 314,
          scale: 0.9
        },
        {
          type: "pipe",
          x: 285,
          y: 340,
          scale: 0.9
        },
        {
          type: "crate",
          x: 132,
          y: 344,
          scale: 0.8
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 200,
          y: 60
        },
        {
          sprite: 2,
          x: 346,
          y: 75
        },
        {
          sprite: 4,
          x: 490,
          y: 210
        },
        {
          sprite: 6,
          x: 394,
          y: 324
        },
        {
          sprite: 1,
          x: 187,
          y: 318
        },
        {
          sprite: 3,
          x: 92,
          y: 183
        }
      ],
      paths: [
        {
          points: [
            [
              48,
              144
            ],
            [
              48,
              216
            ],
            [
              144,
              216
            ],
            [
              144,
              312
            ],
            [
              360,
              312
            ],
            [
              360,
              344
            ],
            [
              528,
              344
            ]
          ],
          width: 10
        },
        {
          points: [
            [
              168,
              48
            ],
            [
              264,
              48
            ],
            [
              264,
              96
            ],
            [
              480,
              96
            ],
            [
              480,
              160
            ]
          ],
          width: 10
        }
      ],
      patches: [
        {
          x: 54,
          y: 30,
          w: 110,
          h: 56,
          pattern: "dense"
        },
        {
          x: 400,
          y: 32,
          w: 140,
          h: 76,
          pattern: "grid"
        },
        {
          x: 40,
          y: 268,
          w: 110,
          h: 94,
          pattern: "dither"
        },
        {
          x: 412,
          y: 278,
          w: 132,
          h: 62,
          pattern: "grid"
        }
      ],
      signals: [
        {
          x: 280,
          y: 76,
          kind: "node"
        },
        {
          x: 539,
          y: 208,
          kind: "node"
        },
        {
          x: 322,
          y: 322,
          kind: "currency"
        },
        {
          x: 125,
          y: 195,
          kind: "currency"
        }
      ],
      id: "02-circuit-courtyard-complete",
      variant: "complete",
      missingChunks: []
    },
    {
      family: "circuit-courtyard",
      name: "Circuit Courtyard / Loading",
      setting: "Industrial circuit workshop",
      shape: "Courtyard ring",
      summary: "A compact workshop wrapped around an open square, with terminals, tanks and circuit traces. An unfinished outer section reveals missing, wireframe and suspended grid chunks.",
      geometry: {
        polygons: [
          [
            [
              48,
              0
            ],
            [
              528,
              0
            ],
            [
              576,
              48
            ],
            [
              576,
              336
            ],
            [
              528,
              384
            ],
            [
              48,
              384
            ],
            [
              0,
              336
            ],
            [
              0,
              48
            ]
          ]
        ],
        holes: [
          [
            [
              192,
              120
            ],
            [
              384,
              120
            ],
            [
              384,
              264
            ],
            [
              192,
              264
            ]
          ]
        ],
        depth: 24
      },
      props: [
        {
          type: "tank",
          x: 95,
          y: 74,
          scale: 1.1
        },
        {
          type: "pipe",
          x: 158,
          y: 68,
          scale: 0.95
        },
        {
          type: "terminal",
          x: 426,
          y: 72,
          scale: 1.05
        },
        {
          type: "tank",
          x: 88,
          y: 286,
          scale: 0.8
        },
        {
          type: "terminal",
          x: 448,
          y: 314,
          scale: 0.9
        },
        {
          type: "pipe",
          x: 285,
          y: 340,
          scale: 0.9
        },
        {
          type: "crate",
          x: 132,
          y: 344,
          scale: 0.8
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 200,
          y: 60
        },
        {
          sprite: 2,
          x: 346,
          y: 75
        },
        {
          sprite: 4,
          x: 490,
          y: 210
        },
        {
          sprite: 6,
          x: 394,
          y: 324
        },
        {
          sprite: 1,
          x: 187,
          y: 318
        },
        {
          sprite: 3,
          x: 92,
          y: 183
        }
      ],
      paths: [
        {
          points: [
            [
              48,
              144
            ],
            [
              48,
              216
            ],
            [
              144,
              216
            ],
            [
              144,
              312
            ],
            [
              360,
              312
            ],
            [
              360,
              344
            ],
            [
              528,
              344
            ]
          ],
          width: 10
        },
        {
          points: [
            [
              168,
              48
            ],
            [
              264,
              48
            ],
            [
              264,
              96
            ],
            [
              480,
              96
            ],
            [
              480,
              160
            ]
          ],
          width: 10
        }
      ],
      patches: [
        {
          x: 54,
          y: 30,
          w: 110,
          h: 56,
          pattern: "dense"
        },
        {
          x: 400,
          y: 32,
          w: 140,
          h: 76,
          pattern: "grid"
        },
        {
          x: 40,
          y: 268,
          w: 110,
          h: 94,
          pattern: "dither"
        },
        {
          x: 412,
          y: 278,
          w: 132,
          h: 62,
          pattern: "grid"
        }
      ],
      signals: [
        {
          x: 280,
          y: 76,
          kind: "node"
        },
        {
          x: 539,
          y: 208,
          kind: "node"
        },
        {
          x: 322,
          y: 322,
          kind: "currency"
        },
        {
          x: 125,
          y: 195,
          kind: "currency"
        }
      ],
      id: "02-circuit-courtyard-loading",
      variant: "loading",
      missingChunks: [
        {
          x: 432,
          y: 0,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 480,
          y: 0,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 528,
          y: 0,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 28
        },
        {
          x: 432,
          y: 48,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 480,
          y: 48,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 528,
          y: 48,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 480,
          y: 96,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 24
        },
        {
          x: 528,
          y: 96,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        }
      ]
    },
    {
      family: "crystal-mesa",
      name: "Crystal Steps",
      setting: "Crystal cavern",
      shape: "Stepped mesa",
      summary: "A broad, cut stone plateau with dense crystal clusters and exposed strata.",
      geometry: {
        polygons: [
          [
            [
              64,
              0
            ],
            [
              432,
              0
            ],
            [
              432,
              48
            ],
            [
              512,
              48
            ],
            [
              512,
              112
            ],
            [
              560,
              112
            ],
            [
              560,
              288
            ],
            [
              496,
              288
            ],
            [
              496,
              336
            ],
            [
              336,
              336
            ],
            [
              336,
              384
            ],
            [
              96,
              384
            ],
            [
              96,
              336
            ],
            [
              48,
              336
            ],
            [
              48,
              272
            ],
            [
              0,
              272
            ],
            [
              0,
              112
            ],
            [
              64,
              112
            ]
          ]
        ],
        holes: [],
        depth: 30
      },
      props: [
        {
          type: "crystal",
          x: 118,
          y: 70,
          scale: 1.25
        },
        {
          type: "crystal",
          x: 161,
          y: 93,
          scale: 0.75
        },
        {
          type: "crystal",
          x: 445,
          y: 112,
          scale: 1.45
        },
        {
          type: "crystal",
          x: 479,
          y: 148,
          scale: 0.75
        },
        {
          type: "rock",
          x: 313,
          y: 60,
          scale: 0.95
        },
        {
          type: "rock",
          x: 79,
          y: 216,
          scale: 0.95
        },
        {
          type: "crystal",
          x: 184,
          y: 336,
          scale: 1.15
        },
        {
          type: "rock",
          x: 398,
          y: 294,
          scale: 1.05
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 218,
          y: 107
        },
        {
          sprite: 1,
          x: 350,
          y: 146
        },
        {
          sprite: 3,
          x: 450,
          y: 243
        },
        {
          sprite: 4,
          x: 286,
          y: 262
        },
        {
          sprite: 6,
          x: 111,
          y: 165
        },
        {
          sprite: 7,
          x: 297,
          y: 343
        }
      ],
      paths: [
        {
          points: [
            [
              88,
              152
            ],
            [
              200,
              152
            ],
            [
              200,
              212
            ],
            [
              376,
              212
            ],
            [
              376,
              274
            ],
            [
              496,
              274
            ]
          ],
          width: 18
        }
      ],
      patches: [
        {
          x: 82,
          y: 36,
          w: 132,
          h: 102,
          pattern: "dense"
        },
        {
          x: 404,
          y: 74,
          w: 96,
          h: 95,
          pattern: "dither"
        },
        {
          x: 98,
          y: 302,
          w: 232,
          h: 70,
          pattern: "dense"
        },
        {
          x: 40,
          y: 180,
          w: 72,
          h: 84,
          pattern: "dither"
        }
      ],
      signals: [
        {
          x: 186,
          y: 172,
          kind: "currency"
        },
        {
          x: 317,
          y: 204,
          kind: "currency"
        },
        {
          x: 405,
          y: 250,
          kind: "currency"
        }
      ],
      id: "03-crystal-mesa-complete",
      variant: "complete",
      missingChunks: []
    },
    {
      family: "crystal-mesa",
      name: "Crystal Steps / Loading",
      setting: "Crystal cavern",
      shape: "Stepped mesa",
      summary: "A broad, cut stone plateau with dense crystal clusters and exposed strata. An unfinished outer section reveals missing, wireframe and suspended grid chunks.",
      geometry: {
        polygons: [
          [
            [
              64,
              0
            ],
            [
              432,
              0
            ],
            [
              432,
              48
            ],
            [
              512,
              48
            ],
            [
              512,
              112
            ],
            [
              560,
              112
            ],
            [
              560,
              288
            ],
            [
              496,
              288
            ],
            [
              496,
              336
            ],
            [
              336,
              336
            ],
            [
              336,
              384
            ],
            [
              96,
              384
            ],
            [
              96,
              336
            ],
            [
              48,
              336
            ],
            [
              48,
              272
            ],
            [
              0,
              272
            ],
            [
              0,
              112
            ],
            [
              64,
              112
            ]
          ]
        ],
        holes: [],
        depth: 30
      },
      props: [
        {
          type: "crystal",
          x: 118,
          y: 70,
          scale: 1.25
        },
        {
          type: "crystal",
          x: 161,
          y: 93,
          scale: 0.75
        },
        {
          type: "crystal",
          x: 445,
          y: 112,
          scale: 1.45
        },
        {
          type: "crystal",
          x: 479,
          y: 148,
          scale: 0.75
        },
        {
          type: "rock",
          x: 313,
          y: 60,
          scale: 0.95
        },
        {
          type: "crystal",
          x: 184,
          y: 336,
          scale: 1.15
        },
        {
          type: "rock",
          x: 398,
          y: 294,
          scale: 1.05
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 218,
          y: 107
        },
        {
          sprite: 1,
          x: 350,
          y: 146
        },
        {
          sprite: 3,
          x: 450,
          y: 243
        },
        {
          sprite: 4,
          x: 286,
          y: 262
        },
        {
          sprite: 6,
          x: 111,
          y: 165
        },
        {
          sprite: 7,
          x: 297,
          y: 343
        }
      ],
      paths: [
        {
          points: [
            [
              88,
              152
            ],
            [
              200,
              152
            ],
            [
              200,
              212
            ],
            [
              376,
              212
            ],
            [
              376,
              274
            ],
            [
              496,
              274
            ]
          ],
          width: 18
        }
      ],
      patches: [
        {
          x: 82,
          y: 36,
          w: 132,
          h: 102,
          pattern: "dense"
        },
        {
          x: 404,
          y: 74,
          w: 96,
          h: 95,
          pattern: "dither"
        },
        {
          x: 98,
          y: 302,
          w: 232,
          h: 70,
          pattern: "dense"
        },
        {
          x: 40,
          y: 180,
          w: 72,
          h: 84,
          pattern: "dither"
        }
      ],
      signals: [
        {
          x: 186,
          y: 172,
          kind: "currency"
        },
        {
          x: 317,
          y: 204,
          kind: "currency"
        },
        {
          x: 405,
          y: 250,
          kind: "currency"
        }
      ],
      id: "03-crystal-mesa-loading",
      variant: "loading",
      missingChunks: [
        {
          x: 48,
          y: 192,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 0,
          y: 192,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 48,
          y: 240,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 0,
          y: 240,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 24
        },
        {
          x: 96,
          y: 240,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 96,
          y: 288,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 48,
          y: 288,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 32
        },
        {
          x: 96,
          y: 336,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        }
      ]
    },
    {
      family: "rooftop-terrace",
      name: "Rooftop Hangout",
      setting: "Urban rooftop",
      shape: "L terrace",
      summary: "A city roof with an open terrace, vents and planter boxes around an angular footprint.",
      geometry: {
        polygons: [
          [
            [
              0,
              0
            ],
            [
              576,
              0
            ],
            [
              576,
              144
            ],
            [
              240,
              144
            ],
            [
              240,
              384
            ],
            [
              0,
              384
            ]
          ]
        ],
        holes: [],
        depth: 22
      },
      props: [
        {
          type: "tank",
          x: 78,
          y: 52,
          scale: 1.1
        },
        {
          type: "vent",
          x: 316,
          y: 45,
          scale: 0.95
        },
        {
          type: "antenna",
          x: 510,
          y: 42,
          scale: 0.95
        },
        {
          type: "planter",
          x: 421,
          y: 100,
          scale: 0.95
        },
        {
          type: "planter",
          x: 42,
          y: 166,
          scale: 0.9
        },
        {
          type: "bench",
          x: 172,
          y: 222,
          scale: 0.95
        },
        {
          type: "vent",
          x: 55,
          y: 350,
          scale: 0.9
        },
        {
          type: "planter",
          x: 179,
          y: 350,
          scale: 0.95
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 180,
          y: 71
        },
        {
          sprite: 2,
          x: 315,
          y: 120
        },
        {
          sprite: 4,
          x: 500,
          y: 108
        },
        {
          sprite: 5,
          x: 162,
          y: 151
        },
        {
          sprite: 6,
          x: 25,
          y: 252
        },
        {
          sprite: 7,
          x: 196,
          y: 305
        }
      ],
      paths: [
        {
          points: [
            [
              112,
              32
            ],
            [
              112,
              110
            ],
            [
              544,
              110
            ]
          ],
          width: 16
        },
        {
          points: [
            [
              112,
              110
            ],
            [
              112,
              352
            ]
          ],
          width: 16
        }
      ],
      patches: [
        {
          x: 26,
          y: 24,
          w: 98,
          h: 66,
          pattern: "dense"
        },
        {
          x: 274,
          y: 24,
          w: 86,
          h: 48,
          pattern: "grid"
        },
        {
          x: 162,
          y: 227,
          w: 62,
          h: 74,
          pattern: "dither"
        },
        {
          x: 22,
          y: 286,
          w: 66,
          h: 67,
          pattern: "grid"
        },
        {
          x: 160,
          y: 328,
          w: 66,
          h: 40,
          pattern: "dither"
        }
      ],
      signals: [
        {
          x: 271,
          y: 110,
          kind: "currency"
        },
        {
          x: 113,
          y: 220,
          kind: "currency"
        },
        {
          x: 112,
          y: 315,
          kind: "currency"
        }
      ],
      id: "04-rooftop-terrace-complete",
      variant: "complete",
      missingChunks: []
    },
    {
      family: "rooftop-terrace",
      name: "Rooftop Hangout / Loading",
      setting: "Urban rooftop",
      shape: "L terrace",
      summary: "A city roof with an open terrace, vents and planter boxes around an angular footprint. An unfinished outer section reveals missing, wireframe and suspended grid chunks.",
      geometry: {
        polygons: [
          [
            [
              0,
              0
            ],
            [
              576,
              0
            ],
            [
              576,
              144
            ],
            [
              240,
              144
            ],
            [
              240,
              384
            ],
            [
              0,
              384
            ]
          ]
        ],
        holes: [],
        depth: 22
      },
      props: [
        {
          type: "tank",
          x: 78,
          y: 52,
          scale: 1.1
        },
        {
          type: "vent",
          x: 316,
          y: 45,
          scale: 0.95
        },
        {
          type: "planter",
          x: 421,
          y: 100,
          scale: 0.95
        },
        {
          type: "planter",
          x: 42,
          y: 166,
          scale: 0.9
        },
        {
          type: "bench",
          x: 172,
          y: 222,
          scale: 0.95
        },
        {
          type: "vent",
          x: 55,
          y: 350,
          scale: 0.9
        },
        {
          type: "planter",
          x: 179,
          y: 350,
          scale: 0.95
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 180,
          y: 71
        },
        {
          sprite: 2,
          x: 315,
          y: 120
        },
        {
          sprite: 5,
          x: 162,
          y: 151
        },
        {
          sprite: 6,
          x: 25,
          y: 252
        },
        {
          sprite: 7,
          x: 196,
          y: 305
        }
      ],
      paths: [
        {
          points: [
            [
              112,
              32
            ],
            [
              112,
              110
            ],
            [
              544,
              110
            ]
          ],
          width: 16
        },
        {
          points: [
            [
              112,
              110
            ],
            [
              112,
              352
            ]
          ],
          width: 16
        }
      ],
      patches: [
        {
          x: 26,
          y: 24,
          w: 98,
          h: 66,
          pattern: "dense"
        },
        {
          x: 274,
          y: 24,
          w: 86,
          h: 48,
          pattern: "grid"
        },
        {
          x: 162,
          y: 227,
          w: 62,
          h: 74,
          pattern: "dither"
        },
        {
          x: 22,
          y: 286,
          w: 66,
          h: 67,
          pattern: "grid"
        },
        {
          x: 160,
          y: 328,
          w: 66,
          h: 40,
          pattern: "dither"
        }
      ],
      signals: [
        {
          x: 271,
          y: 110,
          kind: "currency"
        },
        {
          x: 113,
          y: 220,
          kind: "currency"
        },
        {
          x: 112,
          y: 315,
          kind: "currency"
        }
      ],
      id: "04-rooftop-terrace-loading",
      variant: "loading",
      missingChunks: [
        {
          x: 384,
          y: 0,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 432,
          y: 0,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 480,
          y: 0,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 32
        },
        {
          x: 528,
          y: 0,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 432,
          y: 48,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 480,
          y: 48,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 528,
          y: 48,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 480,
          y: 96,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 24
        },
        {
          x: 528,
          y: 96,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        }
      ]
    },
    {
      family: "tidal-islands",
      name: "Tidal Islands",
      setting: "Archipelago water world",
      shape: "Fractured islands",
      summary: "Three distinct shore platforms with reed beds, wave marks and buoy signals.",
      geometry: {
        polygons: [
          [
            [
              48,
              48
            ],
            [
              144,
              8
            ],
            [
              208,
              24
            ],
            [
              256,
              80
            ],
            [
              248,
              168
            ],
            [
              192,
              216
            ],
            [
              80,
              208
            ],
            [
              16,
              160
            ],
            [
              0,
              96
            ]
          ],
          [
            [
              344,
              32
            ],
            [
              496,
              24
            ],
            [
              552,
              64
            ],
            [
              576,
              136
            ],
            [
              552,
              208
            ],
            [
              456,
              232
            ],
            [
              352,
              200
            ],
            [
              304,
              128
            ]
          ],
          [
            [
              176,
              280
            ],
            [
              248,
              240
            ],
            [
              320,
              264
            ],
            [
              384,
              328
            ],
            [
              352,
              376
            ],
            [
              240,
              384
            ],
            [
              144,
              360
            ],
            [
              112,
              312
            ]
          ]
        ],
        holes: [],
        depth: 20
      },
      props: [
        {
          type: "reeds",
          x: 53,
          y: 116,
          scale: 1.2
        },
        {
          type: "reeds",
          x: 198,
          y: 173,
          scale: 0.95
        },
        {
          type: "buoy",
          x: 181,
          y: 48,
          scale: 0.9
        },
        {
          type: "rock",
          x: 120,
          y: 63,
          scale: 0.85
        },
        {
          type: "reeds",
          x: 501,
          y: 163,
          scale: 1.1
        },
        {
          type: "buoy",
          x: 387,
          y: 75,
          scale: 1
        },
        {
          type: "rock",
          x: 514,
          y: 91,
          scale: 0.8
        },
        {
          type: "reeds",
          x: 178,
          y: 326,
          scale: 0.9
        },
        {
          type: "buoy",
          x: 352,
          y: 342,
          scale: 0.9
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 121,
          y: 145
        },
        {
          sprite: 2,
          x: 206,
          y: 104
        },
        {
          sprite: 4,
          x: 449,
          y: 90
        },
        {
          sprite: 1,
          x: 421,
          y: 176
        },
        {
          sprite: 5,
          x: 228,
          y: 318
        },
        {
          sprite: 7,
          x: 316,
          y: 353
        }
      ],
      paths: [
        {
          points: [
            [
              72,
              154
            ],
            [
              168,
              154
            ],
            [
              168,
              110
            ],
            [
              216,
              110
            ]
          ],
          width: 14
        },
        {
          points: [
            [
              363,
              116
            ],
            [
              458,
              116
            ],
            [
              458,
              179
            ],
            [
              521,
              179
            ]
          ],
          width: 14
        },
        {
          points: [
            [
              202,
              343
            ],
            [
              275,
              343
            ],
            [
              275,
              298
            ]
          ],
          width: 14
        }
      ],
      patches: [
        {
          x: 25,
          y: 82,
          w: 70,
          h: 56,
          pattern: "water"
        },
        {
          x: 133,
          y: 171,
          w: 87,
          h: 30,
          pattern: "dense"
        },
        {
          x: 358,
          y: 152,
          w: 162,
          h: 51,
          pattern: "water"
        },
        {
          x: 372,
          y: 43,
          w: 128,
          h: 38,
          pattern: "water"
        },
        {
          x: 154,
          y: 318,
          w: 172,
          h: 42,
          pattern: "water"
        }
      ],
      signals: [
        {
          x: 150,
          y: 176,
          kind: "currency"
        },
        {
          x: 485,
          y: 174,
          kind: "currency"
        },
        {
          x: 245,
          y: 369,
          kind: "currency"
        }
      ],
      id: "05-tidal-islands-complete",
      variant: "complete",
      missingChunks: []
    },
    {
      family: "tidal-islands",
      name: "Tidal Islands / Loading",
      setting: "Archipelago water world",
      shape: "Fractured islands",
      summary: "Three distinct shore platforms with reed beds, wave marks and buoy signals. An unfinished outer section reveals missing, wireframe and suspended grid chunks.",
      geometry: {
        polygons: [
          [
            [
              48,
              48
            ],
            [
              144,
              8
            ],
            [
              208,
              24
            ],
            [
              256,
              80
            ],
            [
              248,
              168
            ],
            [
              192,
              216
            ],
            [
              80,
              208
            ],
            [
              16,
              160
            ],
            [
              0,
              96
            ]
          ],
          [
            [
              344,
              32
            ],
            [
              496,
              24
            ],
            [
              552,
              64
            ],
            [
              576,
              136
            ],
            [
              552,
              208
            ],
            [
              456,
              232
            ],
            [
              352,
              200
            ],
            [
              304,
              128
            ]
          ],
          [
            [
              176,
              280
            ],
            [
              248,
              240
            ],
            [
              320,
              264
            ],
            [
              384,
              328
            ],
            [
              352,
              376
            ],
            [
              240,
              384
            ],
            [
              144,
              360
            ],
            [
              112,
              312
            ]
          ]
        ],
        holes: [],
        depth: 20
      },
      props: [
        {
          type: "reeds",
          x: 53,
          y: 116,
          scale: 1.2
        },
        {
          type: "reeds",
          x: 198,
          y: 173,
          scale: 0.95
        },
        {
          type: "buoy",
          x: 181,
          y: 48,
          scale: 0.9
        },
        {
          type: "rock",
          x: 120,
          y: 63,
          scale: 0.85
        },
        {
          type: "buoy",
          x: 387,
          y: 75,
          scale: 1
        },
        {
          type: "reeds",
          x: 178,
          y: 326,
          scale: 0.9
        },
        {
          type: "buoy",
          x: 352,
          y: 342,
          scale: 0.9
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 121,
          y: 145
        },
        {
          sprite: 2,
          x: 206,
          y: 104
        },
        {
          sprite: 1,
          x: 421,
          y: 176
        },
        {
          sprite: 5,
          x: 228,
          y: 318
        },
        {
          sprite: 7,
          x: 316,
          y: 353
        }
      ],
      paths: [
        {
          points: [
            [
              72,
              154
            ],
            [
              168,
              154
            ],
            [
              168,
              110
            ],
            [
              216,
              110
            ]
          ],
          width: 14
        },
        {
          points: [
            [
              363,
              116
            ],
            [
              458,
              116
            ],
            [
              458,
              179
            ],
            [
              521,
              179
            ]
          ],
          width: 14
        },
        {
          points: [
            [
              202,
              343
            ],
            [
              275,
              343
            ],
            [
              275,
              298
            ]
          ],
          width: 14
        }
      ],
      patches: [
        {
          x: 25,
          y: 82,
          w: 70,
          h: 56,
          pattern: "water"
        },
        {
          x: 133,
          y: 171,
          w: 87,
          h: 30,
          pattern: "dense"
        },
        {
          x: 358,
          y: 152,
          w: 162,
          h: 51,
          pattern: "water"
        },
        {
          x: 372,
          y: 43,
          w: 128,
          h: 38,
          pattern: "water"
        },
        {
          x: 154,
          y: 318,
          w: 172,
          h: 42,
          pattern: "water"
        }
      ],
      signals: [
        {
          x: 150,
          y: 176,
          kind: "currency"
        },
        {
          x: 245,
          y: 369,
          kind: "currency"
        }
      ],
      id: "05-tidal-islands-loading",
      variant: "loading",
      missingChunks: [
        {
          x: 432,
          y: 48,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 480,
          y: 48,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 528,
          y: 48,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 30
        },
        {
          x: 480,
          y: 96,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 528,
          y: 96,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 480,
          y: 144,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 528,
          y: 144,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 26
        }
      ]
    },
    {
      family: "orbital-hex",
      name: "Orbital Array",
      setting: "Orbital outpost",
      shape: "Hex cluster",
      summary: "Three hexagonal decks with dish antennas, solar panels and spare landing geometry.",
      geometry: {
        polygons: [
          [
            [
              20,
              112
            ],
            [
              80,
              32
            ],
            [
              200,
              32
            ],
            [
              260,
              112
            ],
            [
              200,
              192
            ],
            [
              80,
              192
            ]
          ],
          [
            [
              312,
              112
            ],
            [
              372,
              32
            ],
            [
              492,
              32
            ],
            [
              552,
              112
            ],
            [
              492,
              192
            ],
            [
              372,
              192
            ]
          ],
          [
            [
              166,
              300
            ],
            [
              226,
              220
            ],
            [
              346,
              220
            ],
            [
              406,
              300
            ],
            [
              346,
              380
            ],
            [
              226,
              380
            ]
          ]
        ],
        holes: [],
        depth: 26
      },
      props: [
        {
          type: "dish",
          x: 107,
          y: 67,
          scale: 1.2
        },
        {
          type: "terminal",
          x: 203,
          y: 120,
          scale: 0.8
        },
        {
          type: "solar",
          x: 394,
          y: 72,
          scale: 1.05
        },
        {
          type: "solar",
          x: 453,
          y: 92,
          scale: 1
        },
        {
          type: "antenna",
          x: 491,
          y: 148,
          scale: 1
        },
        {
          type: "crate",
          x: 319,
          y: 237,
          scale: 0.65
        },
        {
          type: "dish",
          x: 234,
          y: 247,
          scale: 0.65
        },
        {
          type: "terminal",
          x: 347,
          y: 310,
          scale: 0.75
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 88,
          y: 143
        },
        {
          sprite: 2,
          x: 224,
          y: 82
        },
        {
          sprite: 4,
          x: 393,
          y: 154
        },
        {
          sprite: 6,
          x: 487,
          y: 75
        },
        {
          sprite: 1,
          x: 215,
          y: 326
        },
        {
          sprite: 7,
          x: 306,
          y: 353
        }
      ],
      paths: [
        {
          points: [
            [
              72,
              128
            ],
            [
              146,
              128
            ],
            [
              146,
              157
            ],
            [
              203,
              157
            ]
          ],
          width: 10
        },
        {
          points: [
            [
              353,
              128
            ],
            [
              419,
              128
            ],
            [
              419,
              162
            ],
            [
              494,
              162
            ]
          ],
          width: 10
        },
        {
          points: [
            [
              215,
              323
            ],
            [
              281,
              323
            ],
            [
              281,
              351
            ],
            [
              348,
              351
            ]
          ],
          width: 10
        }
      ],
      patches: [
        {
          x: 59,
          y: 74,
          w: 105,
          h: 50,
          pattern: "grid"
        },
        {
          x: 360,
          y: 55,
          w: 137,
          h: 56,
          pattern: "dense"
        },
        {
          x: 220,
          y: 275,
          w: 120,
          h: 56,
          pattern: "grid"
        }
      ],
      signals: [
        {
          x: 120,
          y: 146,
          kind: "node"
        },
        {
          x: 455,
          y: 155,
          kind: "node"
        },
        {
          x: 279,
          y: 367,
          kind: "currency"
        }
      ],
      id: "06-orbital-hex-complete",
      variant: "complete",
      missingChunks: []
    },
    {
      family: "orbital-hex",
      name: "Orbital Array / Loading",
      setting: "Orbital outpost",
      shape: "Hex cluster",
      summary: "Three hexagonal decks with dish antennas, solar panels and spare landing geometry. An unfinished outer section reveals missing, wireframe and suspended grid chunks.",
      geometry: {
        polygons: [
          [
            [
              20,
              112
            ],
            [
              80,
              32
            ],
            [
              200,
              32
            ],
            [
              260,
              112
            ],
            [
              200,
              192
            ],
            [
              80,
              192
            ]
          ],
          [
            [
              312,
              112
            ],
            [
              372,
              32
            ],
            [
              492,
              32
            ],
            [
              552,
              112
            ],
            [
              492,
              192
            ],
            [
              372,
              192
            ]
          ],
          [
            [
              166,
              300
            ],
            [
              226,
              220
            ],
            [
              346,
              220
            ],
            [
              406,
              300
            ],
            [
              346,
              380
            ],
            [
              226,
              380
            ]
          ]
        ],
        holes: [],
        depth: 26
      },
      props: [
        {
          type: "dish",
          x: 107,
          y: 67,
          scale: 1.2
        },
        {
          type: "terminal",
          x: 203,
          y: 120,
          scale: 0.8
        },
        {
          type: "solar",
          x: 394,
          y: 72,
          scale: 1.05
        },
        {
          type: "antenna",
          x: 491,
          y: 148,
          scale: 1
        },
        {
          type: "crate",
          x: 319,
          y: 237,
          scale: 0.65
        },
        {
          type: "dish",
          x: 234,
          y: 247,
          scale: 0.65
        },
        {
          type: "terminal",
          x: 347,
          y: 310,
          scale: 0.75
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 88,
          y: 143
        },
        {
          sprite: 2,
          x: 224,
          y: 82
        },
        {
          sprite: 4,
          x: 393,
          y: 154
        },
        {
          sprite: 1,
          x: 215,
          y: 326
        },
        {
          sprite: 7,
          x: 306,
          y: 353
        }
      ],
      paths: [
        {
          points: [
            [
              72,
              128
            ],
            [
              146,
              128
            ],
            [
              146,
              157
            ],
            [
              203,
              157
            ]
          ],
          width: 10
        },
        {
          points: [
            [
              353,
              128
            ],
            [
              419,
              128
            ],
            [
              419,
              162
            ],
            [
              494,
              162
            ]
          ],
          width: 10
        },
        {
          points: [
            [
              215,
              323
            ],
            [
              281,
              323
            ],
            [
              281,
              351
            ],
            [
              348,
              351
            ]
          ],
          width: 10
        }
      ],
      patches: [
        {
          x: 59,
          y: 74,
          w: 105,
          h: 50,
          pattern: "grid"
        },
        {
          x: 360,
          y: 55,
          w: 137,
          h: 56,
          pattern: "dense"
        },
        {
          x: 220,
          y: 275,
          w: 120,
          h: 56,
          pattern: "grid"
        }
      ],
      signals: [
        {
          x: 120,
          y: 146,
          kind: "node"
        },
        {
          x: 455,
          y: 155,
          kind: "node"
        },
        {
          x: 279,
          y: 367,
          kind: "currency"
        }
      ],
      id: "06-orbital-hex-loading",
      variant: "loading",
      missingChunks: [
        {
          x: 384,
          y: 0,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 432,
          y: 0,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 480,
          y: 0,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 34
        },
        {
          x: 432,
          y: 48,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 480,
          y: 48,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 528,
          y: 48,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 480,
          y: 96,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 528,
          y: 96,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 25
        }
      ]
    }
  ]
};

// dist/friend-world.js
var CANVAS = Object.freeze({ width: 1600, height: 1200 });
var PALETTE = Object.freeze({ white: "#FFFFFF", black: "#000000", accent: "#CCFF00" });
var GAME_PALETTE = Object.freeze({
  meadow: "#B9D984",
  pond: "#7DB4DB",
  sun: "#F2CE68",
  coral: "#ED927E",
  lilac: "#B3A0D8"
});
var PROJECTION = Object.freeze({ a: 0.8660254038, b: 0.28, scale: 1.5, width: 576, height: 384, cx: 800, cy: 690 });
var PROP_CANVAS = Object.freeze({ width: 240, height: 240, anchorX: 120, anchorY: 180 });
var PROP_TYPES = Object.freeze([
  "tree",
  "flower",
  "bench",
  "planter",
  "terminal",
  "crate",
  "pipe",
  "tank",
  "crystal",
  "rock",
  "vent",
  "antenna",
  "solar",
  "dish",
  "buoy",
  "reeds",
  "bridge",
  "circuit"
]);
var trustedWorlds = /* @__PURE__ */ new WeakSet();
var boundaryCache = /* @__PURE__ */ new WeakMap();
function finite(value, label, min = -1e6, max = 1e6) {
  if (typeof value !== "number" || !Number.isFinite(value))
    throw new TypeError(`${label} must be a finite number.`);
  if (value < min || value > max)
    throw new RangeError(`${label} must be between ${min} and ${max}.`);
}
function record(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new TypeError(`${label} must be an object.`);
  return value;
}
function text(value, label, max = 500) {
  if (typeof value !== "string" || !value.trim() || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) {
    throw new TypeError(`${label} must be nonempty text of at most ${max} characters.`);
  }
  return value;
}
function array(value, label, max = 128) {
  if (value === void 0)
    return [];
  if (!Array.isArray(value) || value.length > max)
    throw new TypeError(`${label} must be an array with at most ${max} entries.`);
  return value;
}
function choice(value, choices, label) {
  if (typeof value !== "string" || !choices.includes(value))
    throw new TypeError(`Unsupported ${label}: ${String(value)}.`);
  return value;
}
function point(value, label, bounded = true) {
  if (!Array.isArray(value) || value.length !== 2)
    throw new TypeError(`${label} must be [x, y].`);
  finite(value[0], `${label}.x`, bounded ? 0 : -1e6, bounded ? PROJECTION.width : 1e6);
  finite(value[1], `${label}.y`, bounded ? 0 : -1e6, bounded ? PROJECTION.height : 1e6);
  return [value[0], value[1]];
}
function anchor(value, label) {
  const item = record(value, label);
  const [x, y] = point([item.x, item.y], label);
  return { x, y };
}
function rectangle(value, label, relative = false) {
  const item = record(value, label);
  finite(item.x, `${label}.x`, relative ? -576 : 0, 576);
  finite(item.y, `${label}.y`, relative ? -384 : 0, 384);
  finite(item.w, `${label}.w`, 1e-3, 576);
  finite(item.h, `${label}.h`, 1e-3, 384);
  if (!relative && (item.x + item.w > 576 || item.y + item.h > 384))
    throw new RangeError(`${label} extends beyond the world coordinate grid.`);
  return { x: item.x, y: item.y, w: item.w, h: item.h };
}
function deepFreeze(value) {
  if (value && typeof value === "object") {
    for (const child of Object.values(value))
      deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}
function polygonPoints(value, label) {
  const points = array(value, label).map((entry, index) => point(entry, `${label}[${index}]`));
  if (points.length < 3)
    throw new TypeError(`${label} needs at least three vertices.`);
  let twiceArea = 0;
  for (let index = 0; index < points.length; index++) {
    const a = points[index], b = points[(index + 1) % points.length];
    if (a[0] === b[0] && a[1] === b[1])
      throw new TypeError(`${label} contains a zero-length edge.`);
    twiceArea += a[0] * b[1] - b[0] * a[1];
  }
  if (Math.abs(twiceArea) < 1e-3)
    throw new TypeError(`${label} must enclose an area.`);
  const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const onSegment = (a, b, p) => Math.abs(cross(a, b, p)) < 1e-8 && p[0] >= Math.min(a[0], b[0]) && p[0] <= Math.max(a[0], b[0]) && p[1] >= Math.min(a[1], b[1]) && p[1] <= Math.max(a[1], b[1]);
  for (let i = 0; i < points.length; i++)
    for (let j = i + 1; j < points.length; j++) {
      if (j === i + 1 || i === 0 && j === points.length - 1)
        continue;
      const a = points[i], b = points[(i + 1) % points.length], c = points[j], d = points[(j + 1) % points.length];
      if (cross(a, b, c) * cross(a, b, d) < 0 && cross(c, d, a) * cross(c, d, b) < 0 || onSegment(a, b, c) || onSegment(a, b, d) || onSegment(c, d, a) || onSegment(c, d, b)) {
        throw new TypeError(`${label} must be a simple polygon without crossing edges.`);
      }
    }
  return points;
}
function validateWorld(value) {
  if (value && typeof value === "object" && trustedWorlds.has(value))
    return value;
  const source = record(value, "world"), geometry = record(source.geometry, "geometry");
  const polygons = array(geometry.polygons, "geometry.polygons", 16).map((entry, index) => polygonPoints(entry, `polygons[${index}]`));
  if (!polygons.length)
    throw new TypeError("World geometry needs a polygon.");
  const holes = array(geometry.holes, "geometry.holes", 16).map((entry, index) => polygonPoints(entry, `holes[${index}]`));
  if ([...polygons, ...holes].reduce((sum, loop) => sum + loop.length, 0) > 512)
    throw new RangeError("World geometry supports at most 512 vertices.");
  const depth = geometry.depth ?? 18;
  finite(depth, "geometry.depth", 1, 100);
  const props = array(source.props, "props").map((entry, index) => {
    const item = record(entry, `props[${index}]`);
    const type = choice(item.type, PROP_TYPES, "prop type");
    const scale = item.scale ?? 1;
    finite(scale, "prop.scale", 0.1, 4);
    return {
      ...anchor(item, `props[${index}]`),
      type,
      scale,
      ...item.footprint === void 0 ? {} : { footprint: item.footprint === null ? null : rectangle(item.footprint, "prop.footprint", true) }
    };
  });
  const actors = array(source.actors, "actors").map((entry, index) => {
    const item = record(entry, `actors[${index}]`);
    if (item.sprite !== void 0) {
      finite(item.sprite, "actor.sprite", 0, 255);
      if (!Number.isInteger(item.sprite))
        throw new TypeError("actor.sprite must be an integer index.");
    }
    return { ...anchor(item, `actors[${index}]`), ...item.sprite === void 0 ? {} : { sprite: item.sprite } };
  });
  const signals = array(source.signals, "signals").map((entry, index) => {
    const item = record(entry, `signals[${index}]`);
    return { ...anchor(item, `signals[${index}]`), kind: choice(item.kind, ["currency", "node"], "signal kind") };
  });
  const paths = array(source.paths, "paths", 64).map((entry, index) => {
    const item = record(entry, `paths[${index}]`);
    const points = array(item.points, "path.points").map((entry2, index2) => point(entry2, `path.points[${index2}]`));
    if (points.length < 2)
      throw new TypeError("A path needs at least two points.");
    const width = item.width ?? 20;
    finite(width, "path.width", 1, 96);
    return { points, width };
  });
  const patches = array(source.patches, "patches").map((entry, index) => {
    const item = record(entry, `patches[${index}]`);
    return { ...rectangle(item, `patches[${index}]`), pattern: choice(item.pattern, ["dither", "dense", "grid", "hatch", "water"], "patch pattern") };
  });
  const missingChunks = array(source.missingChunks, "missingChunks", 64).map((entry, index) => {
    const item = record(entry, `missingChunks[${index}]`), rect = rectangle(item, `missingChunks[${index}]`);
    if (rect.w !== 48 || rect.h !== 48 || rect.x % 48 !== 0 || rect.y % 48 !== 0)
      throw new RangeError("Missing chunks must use the 48 \xD7 48 world grid.");
    const stage = choice(item.stage, ["void", "wireframe", "floating"], "chunk stage"), lift = item.lift ?? (stage === "floating" ? 24 : 0);
    finite(lift, "chunk.lift", stage === "floating" ? 1 : 0, stage === "floating" ? 160 : 0);
    return { ...rect, stage, lift };
  });
  const collision = source.collision === void 0 ? void 0 : record(source.collision, "collision");
  const world = {
    id: text(source.id, "world.id", 100),
    name: text(source.name, "world.name", 120),
    family: text(source.family, "world.family", 100),
    setting: text(source.setting, "world.setting", 120),
    shape: text(source.shape, "world.shape", 120),
    summary: text(source.summary, "world.summary"),
    variant: choice(source.variant, ["complete", "loading"], "world variant"),
    geometry: { polygons, holes, depth },
    props,
    actors,
    signals,
    paths,
    patches,
    missingChunks,
    ...collision ? { collision: { blocked: array(collision.blocked, "collision.blocked").map((entry, index) => rectangle(entry, `collision.blocked[${index}]`)) } } : {}
  };
  if (world.variant === "complete" && missingChunks.length)
    throw new TypeError("A complete world cannot contain missing chunks.");
  if (world.variant === "loading" && !missingChunks.length)
    throw new TypeError("A loading world needs missing chunks.");
  for (const item of [...props, ...actors, ...signals]) {
    if (!containsLoaded(world, [item.x, item.y]))
      throw new RangeError(`World anchor (${item.x}, ${item.y}) is outside loaded ground.`);
  }
  deepFreeze(world);
  trustedWorlds.add(world);
  return world;
}
var n = (value) => Math.round(value * 1e3) / 1e3;
function project(x, y, lift = 0) {
  finite(x, "x");
  finite(y, "y");
  finite(lift, "lift");
  const { a, b, scale, width, height, cx, cy } = PROJECTION;
  return [n(cx + scale * a * (x - y - (width - height) / 2)), n(cy + scale * b * (x + y - (width + height) / 2) - lift)];
}
var rectPoly = ({ x, y, w, h }) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
function inPolygon([x, y], points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i], [xj, yj] = points[j];
    if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}
function containsLoaded(world, point2) {
  return world.geometry.polygons.some((p) => inPolygon(point2, p)) && !(world.geometry.holes || []).some((p) => inPolygon(point2, p)) && !(world.missingChunks || []).some((r) => inPolygon(point2, rectPoly(r)));
}
function materialBoundary(world) {
  const loops = [...world.geometry.polygons, ...world.geometry.holes || [], ...(world.missingChunks || []).map(rectPoly)];
  const edges = loops.flatMap((p) => p.map((a, i) => [a, p[(i + 1) % p.length]]));
  const cross = (a, b) => a[0] * b[1] - a[1] * b[0], sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const result = [], seen = /* @__PURE__ */ new Set();
  for (const [a, b] of edges) {
    const v = sub(b, a), vv = v[0] * v[0] + v[1] * v[1], ts = [0, 1];
    if (vv < 1e-8)
      continue;
    for (const [c, d] of edges) {
      const w = sub(d, c), ca = sub(c, a), den = cross(v, w);
      if (Math.abs(den) > 1e-8) {
        const t = cross(ca, w) / den, u = cross(ca, v) / den;
        if (t > 1e-7 && t < 1 - 1e-7 && u >= -1e-7 && u <= 1 + 1e-7)
          ts.push(t);
      } else if (Math.abs(cross(ca, v)) < 1e-7) {
        for (const q of [c, d]) {
          const t = ((q[0] - a[0]) * v[0] + (q[1] - a[1]) * v[1]) / vv;
          if (t > 1e-7 && t < 1 - 1e-7)
            ts.push(t);
        }
      }
    }
    ts.sort((x, y) => x - y);
    for (let i = 1; i < ts.length; i++) {
      if (ts[i] - ts[i - 1] < 1e-7)
        continue;
      let p = [a[0] + v[0] * ts[i - 1], a[1] + v[1] * ts[i - 1]], q = [a[0] + v[0] * ts[i], a[1] + v[1] * ts[i]];
      const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], e = 0.04 / Math.sqrt(vv), normal = [-v[1] * e, v[0] * e];
      const left = containsLoaded(world, [m[0] + normal[0], m[1] + normal[1]]), right = containsLoaded(world, [m[0] - normal[0], m[1] - normal[1]]);
      if (left === right)
        continue;
      if (!left)
        [p, q] = [q, p];
      const key = [p, q].map((k) => k.map(n).join(",")).sort().join("|");
      if (!seen.has(key)) {
        seen.add(key);
        result.push([p, q]);
      }
    }
  }
  return result;
}
var PROP_COLORS = Object.freeze({
  tree: "meadow",
  flower: "coral",
  bench: "sun",
  planter: "coral",
  terminal: "lilac",
  crate: "sun",
  pipe: "pond",
  tank: "pond",
  crystal: "lilac",
  rock: "lilac",
  vent: "coral",
  antenna: "lilac",
  solar: "pond",
  dish: "lilac",
  buoy: "coral",
  reeds: "sun",
  bridge: "sun",
  circuit: "lilac"
});
var PROP_FOOTPRINTS = deepFreeze({
  tree: { w: 12, h: 12 },
  flower: null,
  bench: { w: 58, h: 18 },
  planter: { w: 44, h: 30 },
  terminal: { w: 28, h: 26 },
  crate: { w: 31, h: 31 },
  pipe: { w: 60, h: 26 },
  tank: { w: 52, h: 40 },
  crystal: { w: 60, h: 26 },
  rock: { w: 50, h: 32 },
  vent: { w: 47, h: 37 },
  antenna: { w: 30, h: 27 },
  solar: { w: 76, h: 36 },
  dish: { w: 40, h: 33 },
  buoy: { w: 30, h: 20 },
  reeds: null,
  bridge: null,
  circuit: null
});
function boundaryOf(world) {
  let boundary = boundaryCache.get(world);
  if (!boundary) {
    boundary = materialBoundary(world);
    boundaryCache.set(world, boundary);
  }
  return boundary;
}
function distanceToSegment([x, y], a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy);
}
function circleIntersectsRect([x, y], radius, rect) {
  const nearX = Math.max(rect.x, Math.min(rect.x + rect.w, x));
  const nearY = Math.max(rect.y, Math.min(rect.y + rect.h, y));
  return Math.hypot(x - nearX, y - nearY) <= radius;
}
function isWorldWalkable(world, location, radius = 0) {
  const config = validateWorld(world), position = point(location, "location", false);
  finite(radius, "radius", 0, 48);
  if (!containsLoaded(config, position))
    return false;
  if (radius && boundaryOf(config).some(([a, b]) => distanceToSegment(position, a, b) < radius))
    return false;
  const blocked = [...config.collision?.blocked ?? [], ...config.patches.filter((patch) => patch.pattern === "water")];
  for (const prop of config.props) {
    const size = PROP_FOOTPRINTS[prop.type];
    const scale = prop.scale ?? 1;
    const relative = prop.footprint === void 0 ? size && {
      x: -size.w * 1.4 / PROJECTION.scale / 2,
      y: -size.h * 1.4 / PROJECTION.scale / 2,
      w: size.w * 1.4 / PROJECTION.scale,
      h: size.h * 1.4 / PROJECTION.scale
    } : prop.footprint;
    if (relative)
      blocked.push({ x: prop.x + relative.x * scale, y: prop.y + relative.y * scale, w: relative.w * scale, h: relative.h * scale });
  }
  return !blocked.some((rect) => circleIntersectsRect(position, radius, rect));
}
var WORLD_PRESETS = Object.freeze(friend_worlds_default.worlds.map(validateWorld));
function getWorldPreset(id) {
  const world = WORLD_PRESETS.find((candidate) => candidate.id === id);
  if (!world)
    throw new RangeError(`Unknown world preset: ${id}.`);
  return world;
}

// dist/friend-navigation.js
function createWorldNavigator(world, radius = 7, spacing = 8) {
  if (!Number.isFinite(radius) || radius < 0 || !Number.isFinite(spacing) || spacing < 2 || spacing > 32) {
    throw new RangeError("Navigation needs a nonnegative radius and a grid spacing from 2 to 32.");
  }
  const columns = Math.floor(576 / spacing) + 1;
  const rows = Math.floor(384 / spacing) + 1;
  const count = columns * rows;
  const valid = new Uint8Array(count);
  const location = (index) => [index % columns * spacing, Math.floor(index / columns) * spacing];
  const finite2 = (point2) => point2.every(Number.isFinite);
  const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  for (let index = 0; index < count; index++)
    valid[index] = Number(isWorldWalkable(world, location(index), radius));
  function segmentClear(from, to) {
    if (!finite2(from) || !finite2(to))
      return false;
    const length = distance(from, to);
    if (length > 1200)
      return false;
    const steps = Math.max(1, Math.ceil(length / 2));
    for (let index = 0; index <= steps; index++) {
      const t = index / steps;
      if (!isWorldWalkable(world, [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t], radius))
        return false;
    }
    return true;
  }
  function nearby(point2) {
    const centerX = Math.round(point2[0] / spacing), centerY = Math.round(point2[1] / spacing);
    const result = [];
    for (let dy = -2; dy <= 2; dy++)
      for (let dx = -2; dx <= 2; dx++) {
        const x = centerX + dx, y = centerY + dy;
        if (x < 0 || y < 0 || x >= columns || y >= rows)
          continue;
        const index = y * columns + x;
        if (valid[index] && segmentClear(point2, location(index)))
          result.push(index);
      }
    return result;
  }
  function route(from, to) {
    if (!finite2(from) || !finite2(to) || !isWorldWalkable(world, from, radius) || !isWorldWalkable(world, to, radius))
      return null;
    if (segmentClear(from, to))
      return [[to[0], to[1]]];
    const starts = nearby(from), ends = new Set(nearby(to));
    if (!starts.length || !ends.size)
      return null;
    const parents = new Int32Array(count).fill(-1);
    const costs = new Float64Array(count).fill(Infinity);
    const closed = new Uint8Array(count);
    const open = new Set(starts);
    for (const index of starts)
      costs[index] = distance(from, location(index));
    let reached = -1;
    while (open.size) {
      let current = -1, best = Infinity;
      for (const candidate of open) {
        const score = costs[candidate] + distance(location(candidate), to);
        if (score < best) {
          current = candidate;
          best = score;
        }
      }
      if (current < 0)
        break;
      if (ends.has(current)) {
        reached = current;
        break;
      }
      open.delete(current);
      closed[current] = 1;
      const x = current % columns, y = Math.floor(current / columns);
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy || x + dx < 0 || x + dx >= columns || y + dy < 0 || y + dy >= rows)
            continue;
          const neighbor = (y + dy) * columns + x + dx;
          if (!valid[neighbor] || closed[neighbor])
            continue;
          const nextCost = costs[current] + spacing * Math.hypot(dx, dy);
          if (nextCost >= costs[neighbor] || !segmentClear(location(current), location(neighbor)))
            continue;
          costs[neighbor] = nextCost;
          parents[neighbor] = current;
          open.add(neighbor);
        }
    }
    if (reached < 0)
      return null;
    const path = [[to[0], to[1]]];
    for (let index = reached; index !== -1; index = parents[index])
      path.unshift(location(index));
    const simplified = [];
    let anchor2 = from;
    for (let index = 0; index < path.length; ) {
      let last = path.length - 1;
      while (last > index && !segmentClear(anchor2, path[last]))
        last--;
      simplified.push(path[last]);
      anchor2 = path[last];
      index = last + 1;
    }
    return simplified;
  }
  return { route, segmentClear };
}

// games/sparking-stars/terrains.json
var terrains_default = [
  {
    name: "La Citadelle",
    subtitle: "Une longue \xE9preuve, des \xE9pingles et peu de marge.",
    difficulty: "Ma\xEEtrise",
    width: 18,
    reach: 10,
    route: [
      [
        288,
        330
      ],
      [
        80,
        325
      ],
      [
        70,
        245
      ],
      [
        150,
        245
      ],
      [
        150,
        175
      ],
      [
        75,
        145
      ],
      [
        75,
        60
      ],
      [
        195,
        60
      ],
      [
        210,
        140
      ],
      [
        280,
        95
      ],
      [
        340,
        60
      ],
      [
        340,
        150
      ],
      [
        430,
        150
      ],
      [
        435,
        65
      ],
      [
        505,
        65
      ],
      [
        505,
        240
      ],
      [
        420,
        215
      ],
      [
        415,
        320
      ],
      [
        350,
        285
      ]
    ],
    holes: [
      [
        215,
        195,
        115,
        65
      ]
    ],
    blocks: [
      [
        110,
        95,
        35,
        30
      ],
      [
        375,
        85,
        25,
        30
      ],
      [
        455,
        270,
        24,
        30
      ]
    ],
    props: [
      [
        "antenna",
        350,
        240,
        0.5
      ],
      [
        "rock",
        127,
        110,
        0.7
      ],
      [
        "crate",
        387,
        100,
        0.6
      ],
      [
        "crystal",
        467,
        285,
        0.7
      ]
    ],
    shape: [
      [
        30,
        20
      ],
      [
        210,
        20
      ],
      [
        240,
        35
      ],
      [
        340,
        20
      ],
      [
        550,
        20
      ],
      [
        550,
        350
      ],
      [
        425,
        372
      ],
      [
        285,
        355
      ],
      [
        130,
        375
      ],
      [
        28,
        350
      ]
    ],
    level: 6
  },
  {
    name: "La Fabrique",
    subtitle: "Encha\xEEne les chicanes entre les machines.",
    difficulty: "Expert",
    width: 21,
    reach: 12,
    route: [
      [
        288,
        325
      ],
      [
        90,
        325
      ],
      [
        85,
        240
      ],
      [
        165,
        205
      ],
      [
        85,
        145
      ],
      [
        85,
        60
      ],
      [
        230,
        60
      ],
      [
        215,
        130
      ],
      [
        300,
        160
      ],
      [
        350,
        65
      ],
      [
        490,
        65
      ],
      [
        500,
        140
      ],
      [
        415,
        180
      ],
      [
        495,
        225
      ],
      [
        475,
        320
      ],
      [
        385,
        285
      ]
    ],
    holes: [],
    blocks: [
      [
        210,
        210,
        130,
        52
      ],
      [
        125,
        95,
        40,
        35
      ],
      [
        380,
        100,
        28,
        35
      ]
    ],
    props: [
      [
        "tank",
        275,
        235,
        0.65
      ],
      [
        "pipe",
        145,
        110,
        0.8
      ],
      [
        "vent",
        394,
        118,
        0.7
      ],
      [
        "solar",
        330,
        200,
        0.6
      ]
    ],
    shape: [
      [
        35,
        24
      ],
      [
        540,
        24
      ],
      [
        540,
        350
      ],
      [
        385,
        370
      ],
      [
        220,
        352
      ],
      [
        35,
        350
      ]
    ],
    level: 5
  },
  {
    name: "Les Ruines",
    subtitle: "Un grand slalom autour des vestiges.",
    difficulty: "Technique",
    width: 24,
    reach: 14,
    route: [
      [
        288,
        325
      ],
      [
        80,
        325
      ],
      [
        75,
        245
      ],
      [
        175,
        245
      ],
      [
        175,
        165
      ],
      [
        75,
        165
      ],
      [
        75,
        65
      ],
      [
        285,
        65
      ],
      [
        285,
        155
      ],
      [
        390,
        155
      ],
      [
        390,
        65
      ],
      [
        505,
        65
      ],
      [
        505,
        245
      ],
      [
        390,
        245
      ],
      [
        390,
        325
      ]
    ],
    holes: [
      [
        220,
        205,
        100,
        65
      ]
    ],
    blocks: [
      [
        110,
        190,
        28,
        25
      ],
      [
        215,
        100,
        28,
        25
      ],
      [
        435,
        190,
        25,
        25
      ]
    ],
    props: [
      [
        "crate",
        123,
        202,
        0.7
      ],
      [
        "rock",
        227,
        112,
        0.8
      ],
      [
        "crystal",
        447,
        202,
        0.7
      ],
      [
        "rock",
        260,
        290,
        0.6
      ]
    ],
    shape: [
      [
        32,
        32
      ],
      [
        205,
        32
      ],
      [
        235,
        16
      ],
      [
        544,
        32
      ],
      [
        544,
        350
      ],
      [
        425,
        366
      ],
      [
        300,
        352
      ],
      [
        32,
        352
      ]
    ],
    level: 4
  },
  {
    name: "Les Canaux",
    subtitle: "Deux bassins, des passages \xE9troits : vise juste.",
    difficulty: "Pr\xE9cision",
    width: 27,
    reach: 15,
    route: [
      [
        288,
        325
      ],
      [
        115,
        315
      ],
      [
        80,
        240
      ],
      [
        80,
        100
      ],
      [
        175,
        65
      ],
      [
        285,
        65
      ],
      [
        290,
        160
      ],
      [
        285,
        245
      ],
      [
        405,
        310
      ],
      [
        500,
        300
      ],
      [
        505,
        160
      ],
      [
        480,
        70
      ],
      [
        390,
        65
      ],
      [
        410,
        200
      ],
      [
        380,
        275
      ]
    ],
    holes: [
      [
        135,
        125,
        100,
        135
      ],
      [
        350,
        100,
        65,
        60
      ]
    ],
    blocks: [],
    props: [
      [
        "reeds",
        165,
        265,
        0.8
      ],
      [
        "buoy",
        365,
        170,
        0.7
      ],
      [
        "bench",
        300,
        200,
        0.6
      ]
    ],
    shape: [
      [
        32,
        32
      ],
      [
        544,
        32
      ],
      [
        560,
        176
      ],
      [
        544,
        352
      ],
      [
        352,
        368
      ],
      [
        32,
        352
      ]
    ],
    level: 3
  },
  {
    name: "La Carri\xE8re",
    subtitle: "Contourne les rochers et n\xE9gocie les \xE9pingles.",
    difficulty: "Virages",
    width: 32,
    reach: 17,
    route: [
      [
        288,
        320
      ],
      [
        140,
        310
      ],
      [
        90,
        230
      ],
      [
        165,
        190
      ],
      [
        90,
        100
      ],
      [
        220,
        65
      ],
      [
        295,
        110
      ],
      [
        385,
        65
      ],
      [
        485,
        110
      ],
      [
        445,
        195
      ],
      [
        500,
        275
      ],
      [
        405,
        315
      ]
    ],
    holes: [],
    blocks: [
      [
        220,
        155,
        145,
        95
      ]
    ],
    props: [
      [
        "rock",
        235,
        174,
        1
      ],
      [
        "rock",
        330,
        205,
        1.5
      ],
      [
        "crystal",
        280,
        230,
        0.7
      ],
      [
        "rock",
        380,
        170,
        0.8
      ]
    ],
    shape: [
      [
        44,
        38
      ],
      [
        224,
        16
      ],
      [
        300,
        32
      ],
      [
        448,
        16
      ],
      [
        550,
        90
      ],
      [
        530,
        200
      ],
      [
        560,
        315
      ],
      [
        436,
        360
      ],
      [
        288,
        348
      ],
      [
        156,
        370
      ],
      [
        32,
        305
      ],
      [
        52,
        190
      ],
      [
        24,
        110
      ]
    ],
    level: 2
  },
  {
    name: "Le Jardin",
    subtitle: "Deux boucles, un croisement : trouve ton rythme dans le Jardin en huit.",
    difficulty: "D\xE9couverte",
    width: 44,
    reach: 21,
    route: [
      [
        150,
        285
      ],
      [
        85,
        220
      ],
      [
        85,
        140
      ],
      [
        140,
        95
      ],
      [
        195,
        95
      ],
      [
        405,
        285
      ],
      [
        465,
        255
      ],
      [
        495,
        185
      ],
      [
        465,
        115
      ],
      [
        405,
        95
      ],
      [
        195,
        285
      ]
    ],
    holes: [],
    blocks: [],
    props: [
      [
        "tree",
        145,
        185,
        0.6
      ],
      [
        "flower",
        160,
        220,
        1
      ],
      [
        "flower",
        410,
        185,
        1
      ]
    ],
    shape: [
      [
        72,
        48
      ],
      [
        240,
        12
      ],
      [
        420,
        24
      ],
      [
        540,
        96
      ],
      [
        560,
        240
      ],
      [
        456,
        348
      ],
      [
        220,
        372
      ],
      [
        64,
        304
      ],
      [
        24,
        160
      ]
    ],
    level: 1,
    startingObstacle: [
      180,
      252
    ]
  }
];

// games/sparking-stars/terrains.ts
var garden = getWorldPreset("01-garden-oval-complete");
var terrains = terrains_default.map((d, index) => {
  const route = d.route.map(([x, y]) => [x, y]);
  const holes = d.holes.map(([x, y, w, h]) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
  const world = validateWorld({
    ...garden,
    id: `sparking-gen-${index + 1}`,
    name: d.name,
    actors: [],
    signals: [],
    missingChunks: [],
    geometry: { polygons: [d.shape], holes, depth: 18 + (d.level - 1) * 3 },
    paths: [{ points: [...route, route[0]], width: d.width }],
    patches: [],
    props: d.props.map(([type, x, y, scale]) => ({ type, x: Number(x), y: Number(y), scale: Number(scale) })),
    collision: { blocked: d.blocks.map(([x, y, w, h]) => ({ x, y, w, h })) }
  });
  return { ...d, route, world, gen: index + 1 };
});
function startingObstacle(t) {
  if (t.startingObstacle) return [t.startingObstacle[0], t.startingObstacle[1]];
  const [a, b] = t.route;
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}
function distanceToRoute(point2, route) {
  return Math.min(...route.map((a, i) => {
    const b = route[(i + 1) % route.length], dx = b[0] - a[0], dy = b[1] - a[1];
    const t = Math.max(0, Math.min(1, ((point2[0] - a[0]) * dx + (point2[1] - a[1]) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(point2[0] - a[0] - t * dx, point2[1] - a[1] - t * dy);
  }));
}

// games/sparking-stars/rules-version.ts
var RULES = "race-fbad67324acefafc";

// server/validation.ts
var worlds = terrains.map((t) => {
  const [x, y] = startingObstacle(t);
  return validateWorld({ ...t.world, props: [...t.world.props, { type: "crate", x, y, scale: 1, footprint: { x: -12, y: -12, w: 24, h: 24 } }] });
});
var navigators = worlds.map((w) => createWorldNavigator(w, 7));
function validateTrace(gen, equipment, trace) {
  const reject = () => {
    throw new Error("Parcours refus\xE9 : trajectoire ou chronom\xE9trage incoh\xE9rent.");
  };
  if (!Number.isInteger(gen) || gen < 1 || gen > 6 || !["feet", "rollers", "kart"].includes(equipment) || !Array.isArray(trace) || trace.length < 3 || trace.length > 4e4) return reject();
  const t = terrains[gen - 1], world = worlds[gen - 1], nav = navigators[gen - 1], pace = equipment === "kart" ? 1.45 : equipment === "rollers" ? 1.2 : 1;
  let previous = t.route[0], last = 0, next = 1;
  for (let i = 0; i < trace.length; i++) {
    const row = trace[i];
    if (!Array.isArray(row) || row.length !== 3 || !row.every((v) => typeof v === "number" && Number.isFinite(v))) return reject();
    const [time, x, y] = row, point2 = [x, y];
    if (i === 0) {
      if (time !== 0 || Math.hypot(x - previous[0], y - previous[1]) > 1e-3) return reject();
      continue;
    }
    const delta = time - last;
    if (delta <= 0 || time > 6e5 || !isWorldWalkable(world, point2, 7) || !nav.segmentClear(previous, point2)) return reject();
    const [ax, ay] = project(...previous), [bx, by] = project(x, y);
    const road = distanceToRoute(previous, t.route) > t.width / 2 ? Math.max(0.38, 0.8 - (t.level - 1) * 0.08) : 1;
    if (Math.hypot(bx - ax, by - ay) > 170 * 1e-3 * Math.min(100, delta) * pace * road * 1.005 + 2e-3) return reject();
    const target = t.route[next % t.route.length];
    if (Math.hypot(x - target[0], y - target[1]) < t.reach) next++;
    if (next > t.route.length && i !== trace.length - 1) return reject();
    previous = point2;
    last = time;
  }
  if (next !== t.route.length + 1 || last < 1e3) return reject();
  return Math.round(last);
}
export {
  RULES,
  validateTrace
};
