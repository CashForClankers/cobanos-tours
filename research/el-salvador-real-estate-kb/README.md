# El Salvador Real Estate KB

Research project keyed off the Wandering Investor market-guide thesis, but grounded in fresher and more primary material.

This project treats the article as a seed, not as authority. The goal is to separate:
- narrative
- measurable fundamentals
- on-the-ground demand drivers
- policy and financing risks

## Structure

- `raw/`
  - seed article notes
  - source index
- `wiki/`
  - compact working pages
  - each page should distinguish sourced facts from inferences
- `docs/ralph/`
  - PRDs for iterative KB expansion

## Working Thesis

El Salvador real estate is still best understood as a narrative-heavy market:
- security gains changed the country story
- tourism and diaspora demand are real
- remittances remain structurally important
- macro and fiscal constraints still matter

The edge is not in repeating bullish talking points. It is in mapping which submarkets benefit from:
- tourism growth
- return migration
- remittance-supported self-build or upgrade demand
- infrastructure and policy changes

## Source Bias Rules

1. Prefer primary sources first:
- IMF
- World Bank
- BCR
- CEPAL
- official Salvadoran ministries and regulators

2. Search Spanish first when looking for:
- Salvadoran policy documents
- tourism numbers
- housing, planning, or permitting material
- local press detail

3. Use investor blogs and media as:
- thesis inputs
- sentiment markers
- lead generators

4. Every wiki page should mark:
- `Sourced`
- `Inference`
- `Needs verification`

## Ralph Workflow

Validate and inspect the bootstrap PRD:

```bash
ralph validate --prd research/el-salvador-real-estate-kb/docs/ralph/prd.bootstrap.json
ralph graph --prd research/el-salvador-real-estate-kb/docs/ralph/prd.bootstrap.json
```

Run the loop:

```bash
ralph run --prd research/el-salvador-real-estate-kb/docs/ralph/prd.bootstrap.json
```

## Near-Term Expansion Targets

- property rights and transaction mechanics
- municipal permitting and zoning by area
- tourism corridor submarkets
- diaspora / remittance demand segmentation
- hotel and branded-residence pipeline
- credit conditions and bank mortgage availability
