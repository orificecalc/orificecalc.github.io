# Orifice Plate Flow Calculator

A small static web app for estimating flow through an orifice plate from differential pressure.

## Run it

Open `index.html` in a browser.

No build step or package install is required.

## What it calculates

- Calculation types include flowrate from differential pressure and bore, differential pressure from flowrate and bore, and bore diameter from flowrate and differential pressure.
- Liquid mode: incompressible flow with water density calculated from temperature or a manually entered liquid density. Water viscosity is calculated from temperature.
- Gas mode: natural gas density calculated from absolute pressure, temperature, and specific gravity, or a manually entered gas density. Gas viscosity is estimated from flowing temperature, specific gravity, and flowing density. Standard gas volume outputs use base pressure, base temperature, and base compressibility from Settings.
- Gas discharge coefficient can be calculated iteratively for AGA3/API flange taps or entered manually.
- Beta ratio, pipe velocity, mass flow, Reynolds number, and warnings for common input issues.
- Orifice geometry can be entered as bore diameter or beta ratio.
- Pipe inside diameter can be entered manually or selected from ANSI/ASME B36.10 NPS 2 through 24 schedules.
- A Settings page controls the global unit system, gas base pressure, gas base temperature, and base compressibility.
- A printable report can be saved as a PDF from the browser and emailed.
- A plain-text report can be downloaded directly for saving or emailing.

The calculator is intended for quick engineering estimates. For custody transfer, code compliance, or safety-critical sizing, validate against the applicable standard and project conditions.
