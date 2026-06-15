import { useState, useRef, useMemo, useCallback, createContext, useContext } from "react";
import { CaptureFab, CaptureButton } from "./components/CaptureModal.jsx";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";


// ── RICH MOCK DATA ────────────────────────────────────────────────
// Realistic SGC multi-entity demo data — Jan to Dec 2024

const MOCK_GL = [
  {id:"JE001",entityId:"E001",period:"Jan 2024",date:"2024-01-31",ref:"SLS-001",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"MYR",amount:68000,icEntityId:null},
  {id:"JE002",entityId:"E001",period:"Jan 2024",date:"2024-01-31",ref:"PAY-002",description:"Staff costs Jan 2024",drAccount:"5100",crAccount:"2000",currency:"MYR",amount:28560,icEntityId:null},
  {id:"JE003",entityId:"E001",period:"Jan 2024",date:"2024-01-31",ref:"ADM-003",description:"Admin & office Jan 2024",drAccount:"5400",crAccount:"2000",currency:"MYR",amount:8840,icEntityId:null},
  {id:"JE004",entityId:"E001",period:"Jan 2024",date:"2024-01-31",ref:"DEP-004",description:"Depreciation Jan 2024",drAccount:"5300",crAccount:"1500",currency:"MYR",amount:3400,icEntityId:null},
  {id:"JE005",entityId:"E001",period:"Jan 2024",date:"2024-01-31",ref:"COS-005",description:"Cost of delivery Jan 2024",drAccount:"5000",crAccount:"2000",currency:"MYR",amount:12240,icEntityId:null},
  {id:"JE006",entityId:"E001",period:"Feb 2024",date:"2024-02-29",ref:"SLS-006",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"MYR",amount:72000,icEntityId:null},
  {id:"JE007",entityId:"E001",period:"Feb 2024",date:"2024-02-29",ref:"PAY-007",description:"Staff costs Feb 2024",drAccount:"5100",crAccount:"2000",currency:"MYR",amount:30240,icEntityId:null},
  {id:"JE008",entityId:"E001",period:"Feb 2024",date:"2024-02-29",ref:"ADM-008",description:"Admin & office Feb 2024",drAccount:"5400",crAccount:"2000",currency:"MYR",amount:9360,icEntityId:null},
  {id:"JE009",entityId:"E001",period:"Feb 2024",date:"2024-02-29",ref:"DEP-009",description:"Depreciation Feb 2024",drAccount:"5300",crAccount:"1500",currency:"MYR",amount:3600,icEntityId:null},
  {id:"JE010",entityId:"E001",period:"Feb 2024",date:"2024-02-29",ref:"COS-010",description:"Cost of delivery Feb 2024",drAccount:"5000",crAccount:"2000",currency:"MYR",amount:12960,icEntityId:null},
  {id:"JE011",entityId:"E001",period:"Mar 2024",date:"2024-03-31",ref:"SLS-011",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"MYR",amount:85000,icEntityId:null},
  {id:"JE012",entityId:"E001",period:"Mar 2024",date:"2024-03-31",ref:"PAY-012",description:"Staff costs Mar 2024",drAccount:"5100",crAccount:"2000",currency:"MYR",amount:35700,icEntityId:null},
  {id:"JE013",entityId:"E001",period:"Mar 2024",date:"2024-03-31",ref:"ADM-013",description:"Admin & office Mar 2024",drAccount:"5400",crAccount:"2000",currency:"MYR",amount:11050,icEntityId:null},
  {id:"JE014",entityId:"E001",period:"Mar 2024",date:"2024-03-31",ref:"DEP-014",description:"Depreciation Mar 2024",drAccount:"5300",crAccount:"1500",currency:"MYR",amount:4250,icEntityId:null},
  {id:"JE015",entityId:"E001",period:"Mar 2024",date:"2024-03-31",ref:"COS-015",description:"Cost of delivery Mar 2024",drAccount:"5000",crAccount:"2000",currency:"MYR",amount:15300,icEntityId:null},
  {id:"JE016",entityId:"E001",period:"Apr 2024",date:"2024-04-30",ref:"SLS-016",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"MYR",amount:78000,icEntityId:null},
  {id:"JE017",entityId:"E001",period:"Apr 2024",date:"2024-04-30",ref:"PAY-017",description:"Staff costs Apr 2024",drAccount:"5100",crAccount:"2000",currency:"MYR",amount:32760,icEntityId:null},
  {id:"JE018",entityId:"E001",period:"Apr 2024",date:"2024-04-30",ref:"ADM-018",description:"Admin & office Apr 2024",drAccount:"5400",crAccount:"2000",currency:"MYR",amount:10140,icEntityId:null},
  {id:"JE019",entityId:"E001",period:"Apr 2024",date:"2024-04-30",ref:"DEP-019",description:"Depreciation Apr 2024",drAccount:"5300",crAccount:"1500",currency:"MYR",amount:3900,icEntityId:null},
  {id:"JE020",entityId:"E001",period:"Apr 2024",date:"2024-04-30",ref:"COS-020",description:"Cost of delivery Apr 2024",drAccount:"5000",crAccount:"2000",currency:"MYR",amount:14040,icEntityId:null},
  {id:"JE021",entityId:"E001",period:"May 2024",date:"2024-05-31",ref:"SLS-021",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"MYR",amount:92000,icEntityId:null},
  {id:"JE022",entityId:"E001",period:"May 2024",date:"2024-05-31",ref:"PAY-022",description:"Staff costs May 2024",drAccount:"5100",crAccount:"2000",currency:"MYR",amount:38640,icEntityId:null},
  {id:"JE023",entityId:"E001",period:"May 2024",date:"2024-05-31",ref:"ADM-023",description:"Admin & office May 2024",drAccount:"5400",crAccount:"2000",currency:"MYR",amount:11960,icEntityId:null},
  {id:"JE024",entityId:"E001",period:"May 2024",date:"2024-05-31",ref:"DEP-024",description:"Depreciation May 2024",drAccount:"5300",crAccount:"1500",currency:"MYR",amount:4600,icEntityId:null},
  {id:"JE025",entityId:"E001",period:"May 2024",date:"2024-05-31",ref:"COS-025",description:"Cost of delivery May 2024",drAccount:"5000",crAccount:"2000",currency:"MYR",amount:16560,icEntityId:null},
  {id:"JE026",entityId:"E001",period:"Jun 2024",date:"2024-06-30",ref:"SLS-026",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"MYR",amount:105000,icEntityId:null},
  {id:"JE027",entityId:"E001",period:"Jun 2024",date:"2024-06-30",ref:"PAY-027",description:"Staff costs Jun 2024",drAccount:"5100",crAccount:"2000",currency:"MYR",amount:44100,icEntityId:null},
  {id:"JE028",entityId:"E001",period:"Jun 2024",date:"2024-06-30",ref:"ADM-028",description:"Admin & office Jun 2024",drAccount:"5400",crAccount:"2000",currency:"MYR",amount:13650,icEntityId:null},
  {id:"JE029",entityId:"E001",period:"Jun 2024",date:"2024-06-30",ref:"DEP-029",description:"Depreciation Jun 2024",drAccount:"5300",crAccount:"1500",currency:"MYR",amount:5250,icEntityId:null},
  {id:"JE030",entityId:"E001",period:"Jun 2024",date:"2024-06-30",ref:"COS-030",description:"Cost of delivery Jun 2024",drAccount:"5000",crAccount:"2000",currency:"MYR",amount:18900,icEntityId:null},
  {id:"JE031",entityId:"E001",period:"Jul 2024",date:"2024-07-31",ref:"SLS-031",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"MYR",amount:88000,icEntityId:null},
  {id:"JE032",entityId:"E001",period:"Jul 2024",date:"2024-07-31",ref:"PAY-032",description:"Staff costs Jul 2024",drAccount:"5100",crAccount:"2000",currency:"MYR",amount:36960,icEntityId:null},
  {id:"JE033",entityId:"E001",period:"Jul 2024",date:"2024-07-31",ref:"ADM-033",description:"Admin & office Jul 2024",drAccount:"5400",crAccount:"2000",currency:"MYR",amount:11440,icEntityId:null},
  {id:"JE034",entityId:"E001",period:"Jul 2024",date:"2024-07-31",ref:"DEP-034",description:"Depreciation Jul 2024",drAccount:"5300",crAccount:"1500",currency:"MYR",amount:4400,icEntityId:null},
  {id:"JE035",entityId:"E001",period:"Jul 2024",date:"2024-07-31",ref:"COS-035",description:"Cost of delivery Jul 2024",drAccount:"5000",crAccount:"2000",currency:"MYR",amount:15840,icEntityId:null},
  {id:"JE036",entityId:"E001",period:"Aug 2024",date:"2024-08-31",ref:"SLS-036",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"MYR",amount:95000,icEntityId:null},
  {id:"JE037",entityId:"E001",period:"Aug 2024",date:"2024-08-31",ref:"PAY-037",description:"Staff costs Aug 2024",drAccount:"5100",crAccount:"2000",currency:"MYR",amount:39900,icEntityId:null},
  {id:"JE038",entityId:"E001",period:"Aug 2024",date:"2024-08-31",ref:"ADM-038",description:"Admin & office Aug 2024",drAccount:"5400",crAccount:"2000",currency:"MYR",amount:12350,icEntityId:null},
  {id:"JE039",entityId:"E001",period:"Aug 2024",date:"2024-08-31",ref:"DEP-039",description:"Depreciation Aug 2024",drAccount:"5300",crAccount:"1500",currency:"MYR",amount:4750,icEntityId:null},
  {id:"JE040",entityId:"E001",period:"Aug 2024",date:"2024-08-31",ref:"COS-040",description:"Cost of delivery Aug 2024",drAccount:"5000",crAccount:"2000",currency:"MYR",amount:17100,icEntityId:null},
  {id:"JE041",entityId:"E001",period:"Sep 2024",date:"2024-09-30",ref:"SLS-041",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"MYR",amount:110000,icEntityId:null},
  {id:"JE042",entityId:"E001",period:"Sep 2024",date:"2024-09-30",ref:"PAY-042",description:"Staff costs Sep 2024",drAccount:"5100",crAccount:"2000",currency:"MYR",amount:46200,icEntityId:null},
  {id:"JE043",entityId:"E001",period:"Sep 2024",date:"2024-09-30",ref:"ADM-043",description:"Admin & office Sep 2024",drAccount:"5400",crAccount:"2000",currency:"MYR",amount:14300,icEntityId:null},
  {id:"JE044",entityId:"E001",period:"Sep 2024",date:"2024-09-30",ref:"DEP-044",description:"Depreciation Sep 2024",drAccount:"5300",crAccount:"1500",currency:"MYR",amount:5500,icEntityId:null},
  {id:"JE045",entityId:"E001",period:"Sep 2024",date:"2024-09-30",ref:"COS-045",description:"Cost of delivery Sep 2024",drAccount:"5000",crAccount:"2000",currency:"MYR",amount:19800,icEntityId:null},
  {id:"JE046",entityId:"E001",period:"Oct 2024",date:"2024-10-31",ref:"SLS-046",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"MYR",amount:102000,icEntityId:null},
  {id:"JE047",entityId:"E001",period:"Oct 2024",date:"2024-10-31",ref:"PAY-047",description:"Staff costs Oct 2024",drAccount:"5100",crAccount:"2000",currency:"MYR",amount:42840,icEntityId:null},
  {id:"JE048",entityId:"E001",period:"Oct 2024",date:"2024-10-31",ref:"ADM-048",description:"Admin & office Oct 2024",drAccount:"5400",crAccount:"2000",currency:"MYR",amount:13260,icEntityId:null},
  {id:"JE049",entityId:"E001",period:"Oct 2024",date:"2024-10-31",ref:"DEP-049",description:"Depreciation Oct 2024",drAccount:"5300",crAccount:"1500",currency:"MYR",amount:5100,icEntityId:null},
  {id:"JE050",entityId:"E001",period:"Oct 2024",date:"2024-10-31",ref:"COS-050",description:"Cost of delivery Oct 2024",drAccount:"5000",crAccount:"2000",currency:"MYR",amount:18360,icEntityId:null},
  {id:"JE051",entityId:"E001",period:"Nov 2024",date:"2024-11-30",ref:"SLS-051",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"MYR",amount:78000,icEntityId:null},
  {id:"JE052",entityId:"E001",period:"Nov 2024",date:"2024-11-30",ref:"PAY-052",description:"Staff costs Nov 2024",drAccount:"5100",crAccount:"2000",currency:"MYR",amount:32760,icEntityId:null},
  {id:"JE053",entityId:"E001",period:"Nov 2024",date:"2024-11-30",ref:"ADM-053",description:"Admin & office Nov 2024",drAccount:"5400",crAccount:"2000",currency:"MYR",amount:10140,icEntityId:null},
  {id:"JE054",entityId:"E001",period:"Nov 2024",date:"2024-11-30",ref:"DEP-054",description:"Depreciation Nov 2024",drAccount:"5300",crAccount:"1500",currency:"MYR",amount:3900,icEntityId:null},
  {id:"JE055",entityId:"E001",period:"Nov 2024",date:"2024-11-30",ref:"COS-055",description:"Cost of delivery Nov 2024",drAccount:"5000",crAccount:"2000",currency:"MYR",amount:14040,icEntityId:null},
  {id:"JE056",entityId:"E001",period:"Dec 2024",date:"2024-12-31",ref:"SLS-056",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"MYR",amount:95000,icEntityId:null},
  {id:"JE057",entityId:"E001",period:"Dec 2024",date:"2024-12-31",ref:"PAY-057",description:"Staff costs Dec 2024",drAccount:"5100",crAccount:"2000",currency:"MYR",amount:39900,icEntityId:null},
  {id:"JE058",entityId:"E001",period:"Dec 2024",date:"2024-12-31",ref:"ADM-058",description:"Admin & office Dec 2024",drAccount:"5400",crAccount:"2000",currency:"MYR",amount:12350,icEntityId:null},
  {id:"JE059",entityId:"E001",period:"Dec 2024",date:"2024-12-31",ref:"DEP-059",description:"Depreciation Dec 2024",drAccount:"5300",crAccount:"1500",currency:"MYR",amount:4750,icEntityId:null},
  {id:"JE060",entityId:"E001",period:"Dec 2024",date:"2024-12-31",ref:"COS-060",description:"Cost of delivery Dec 2024",drAccount:"5000",crAccount:"2000",currency:"MYR",amount:17100,icEntityId:null},
  {id:"JE061",entityId:"E002",period:"Jan 2024",date:"2024-01-31",ref:"SLS-061",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"SGD",amount:18000,icEntityId:null},
  {id:"JE062",entityId:"E002",period:"Jan 2024",date:"2024-01-31",ref:"PAY-062",description:"Staff costs Jan 2024",drAccount:"5100",crAccount:"2000",currency:"SGD",amount:7560,icEntityId:null},
  {id:"JE063",entityId:"E002",period:"Jan 2024",date:"2024-01-31",ref:"ADM-063",description:"Admin & office Jan 2024",drAccount:"5400",crAccount:"2000",currency:"SGD",amount:2340,icEntityId:null},
  {id:"JE064",entityId:"E002",period:"Jan 2024",date:"2024-01-31",ref:"DEP-064",description:"Depreciation Jan 2024",drAccount:"5300",crAccount:"1500",currency:"SGD",amount:900,icEntityId:null},
  {id:"JE065",entityId:"E002",period:"Jan 2024",date:"2024-01-31",ref:"COS-065",description:"Cost of delivery Jan 2024",drAccount:"5000",crAccount:"2000",currency:"SGD",amount:3240,icEntityId:null},
  {id:"JE066",entityId:"E002",period:"Feb 2024",date:"2024-02-29",ref:"SLS-066",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"SGD",amount:19500,icEntityId:null},
  {id:"JE067",entityId:"E002",period:"Feb 2024",date:"2024-02-29",ref:"PAY-067",description:"Staff costs Feb 2024",drAccount:"5100",crAccount:"2000",currency:"SGD",amount:8190,icEntityId:null},
  {id:"JE068",entityId:"E002",period:"Feb 2024",date:"2024-02-29",ref:"ADM-068",description:"Admin & office Feb 2024",drAccount:"5400",crAccount:"2000",currency:"SGD",amount:2535,icEntityId:null},
  {id:"JE069",entityId:"E002",period:"Feb 2024",date:"2024-02-29",ref:"DEP-069",description:"Depreciation Feb 2024",drAccount:"5300",crAccount:"1500",currency:"SGD",amount:975,icEntityId:null},
  {id:"JE070",entityId:"E002",period:"Feb 2024",date:"2024-02-29",ref:"COS-070",description:"Cost of delivery Feb 2024",drAccount:"5000",crAccount:"2000",currency:"SGD",amount:3510,icEntityId:null},
  {id:"JE071",entityId:"E002",period:"Mar 2024",date:"2024-03-31",ref:"SLS-071",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"SGD",amount:22000,icEntityId:null},
  {id:"JE072",entityId:"E002",period:"Mar 2024",date:"2024-03-31",ref:"PAY-072",description:"Staff costs Mar 2024",drAccount:"5100",crAccount:"2000",currency:"SGD",amount:9240,icEntityId:null},
  {id:"JE073",entityId:"E002",period:"Mar 2024",date:"2024-03-31",ref:"ADM-073",description:"Admin & office Mar 2024",drAccount:"5400",crAccount:"2000",currency:"SGD",amount:2860,icEntityId:null},
  {id:"JE074",entityId:"E002",period:"Mar 2024",date:"2024-03-31",ref:"DEP-074",description:"Depreciation Mar 2024",drAccount:"5300",crAccount:"1500",currency:"SGD",amount:1100,icEntityId:null},
  {id:"JE075",entityId:"E002",period:"Mar 2024",date:"2024-03-31",ref:"COS-075",description:"Cost of delivery Mar 2024",drAccount:"5000",crAccount:"2000",currency:"SGD",amount:3960,icEntityId:null},
  {id:"JE076",entityId:"E002",period:"Apr 2024",date:"2024-04-30",ref:"SLS-076",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"SGD",amount:20000,icEntityId:null},
  {id:"JE077",entityId:"E002",period:"Apr 2024",date:"2024-04-30",ref:"PAY-077",description:"Staff costs Apr 2024",drAccount:"5100",crAccount:"2000",currency:"SGD",amount:8400,icEntityId:null},
  {id:"JE078",entityId:"E002",period:"Apr 2024",date:"2024-04-30",ref:"ADM-078",description:"Admin & office Apr 2024",drAccount:"5400",crAccount:"2000",currency:"SGD",amount:2600,icEntityId:null},
  {id:"JE079",entityId:"E002",period:"Apr 2024",date:"2024-04-30",ref:"DEP-079",description:"Depreciation Apr 2024",drAccount:"5300",crAccount:"1500",currency:"SGD",amount:1000,icEntityId:null},
  {id:"JE080",entityId:"E002",period:"Apr 2024",date:"2024-04-30",ref:"COS-080",description:"Cost of delivery Apr 2024",drAccount:"5000",crAccount:"2000",currency:"SGD",amount:3600,icEntityId:null},
  {id:"JE081",entityId:"E002",period:"May 2024",date:"2024-05-31",ref:"SLS-081",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"SGD",amount:24000,icEntityId:null},
  {id:"JE082",entityId:"E002",period:"May 2024",date:"2024-05-31",ref:"PAY-082",description:"Staff costs May 2024",drAccount:"5100",crAccount:"2000",currency:"SGD",amount:10080,icEntityId:null},
  {id:"JE083",entityId:"E002",period:"May 2024",date:"2024-05-31",ref:"ADM-083",description:"Admin & office May 2024",drAccount:"5400",crAccount:"2000",currency:"SGD",amount:3120,icEntityId:null},
  {id:"JE084",entityId:"E002",period:"May 2024",date:"2024-05-31",ref:"DEP-084",description:"Depreciation May 2024",drAccount:"5300",crAccount:"1500",currency:"SGD",amount:1200,icEntityId:null},
  {id:"JE085",entityId:"E002",period:"May 2024",date:"2024-05-31",ref:"COS-085",description:"Cost of delivery May 2024",drAccount:"5000",crAccount:"2000",currency:"SGD",amount:4320,icEntityId:null},
  {id:"JE086",entityId:"E002",period:"Jun 2024",date:"2024-06-30",ref:"SLS-086",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"SGD",amount:28000,icEntityId:null},
  {id:"JE087",entityId:"E002",period:"Jun 2024",date:"2024-06-30",ref:"PAY-087",description:"Staff costs Jun 2024",drAccount:"5100",crAccount:"2000",currency:"SGD",amount:11760,icEntityId:null},
  {id:"JE088",entityId:"E002",period:"Jun 2024",date:"2024-06-30",ref:"ADM-088",description:"Admin & office Jun 2024",drAccount:"5400",crAccount:"2000",currency:"SGD",amount:3640,icEntityId:null},
  {id:"JE089",entityId:"E002",period:"Jun 2024",date:"2024-06-30",ref:"DEP-089",description:"Depreciation Jun 2024",drAccount:"5300",crAccount:"1500",currency:"SGD",amount:1400,icEntityId:null},
  {id:"JE090",entityId:"E002",period:"Jun 2024",date:"2024-06-30",ref:"COS-090",description:"Cost of delivery Jun 2024",drAccount:"5000",crAccount:"2000",currency:"SGD",amount:5040,icEntityId:null},
  {id:"JE091",entityId:"E002",period:"Jul 2024",date:"2024-07-31",ref:"SLS-091",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"SGD",amount:22000,icEntityId:null},
  {id:"JE092",entityId:"E002",period:"Jul 2024",date:"2024-07-31",ref:"PAY-092",description:"Staff costs Jul 2024",drAccount:"5100",crAccount:"2000",currency:"SGD",amount:9240,icEntityId:null},
  {id:"JE093",entityId:"E002",period:"Jul 2024",date:"2024-07-31",ref:"ADM-093",description:"Admin & office Jul 2024",drAccount:"5400",crAccount:"2000",currency:"SGD",amount:2860,icEntityId:null},
  {id:"JE094",entityId:"E002",period:"Jul 2024",date:"2024-07-31",ref:"DEP-094",description:"Depreciation Jul 2024",drAccount:"5300",crAccount:"1500",currency:"SGD",amount:1100,icEntityId:null},
  {id:"JE095",entityId:"E002",period:"Jul 2024",date:"2024-07-31",ref:"COS-095",description:"Cost of delivery Jul 2024",drAccount:"5000",crAccount:"2000",currency:"SGD",amount:3960,icEntityId:null},
  {id:"JE096",entityId:"E002",period:"Aug 2024",date:"2024-08-31",ref:"SLS-096",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"SGD",amount:26000,icEntityId:null},
  {id:"JE097",entityId:"E002",period:"Aug 2024",date:"2024-08-31",ref:"PAY-097",description:"Staff costs Aug 2024",drAccount:"5100",crAccount:"2000",currency:"SGD",amount:10920,icEntityId:null},
  {id:"JE098",entityId:"E002",period:"Aug 2024",date:"2024-08-31",ref:"ADM-098",description:"Admin & office Aug 2024",drAccount:"5400",crAccount:"2000",currency:"SGD",amount:3380,icEntityId:null},
  {id:"JE099",entityId:"E002",period:"Aug 2024",date:"2024-08-31",ref:"DEP-099",description:"Depreciation Aug 2024",drAccount:"5300",crAccount:"1500",currency:"SGD",amount:1300,icEntityId:null},
  {id:"JE100",entityId:"E002",period:"Aug 2024",date:"2024-08-31",ref:"COS-100",description:"Cost of delivery Aug 2024",drAccount:"5000",crAccount:"2000",currency:"SGD",amount:4680,icEntityId:null},
  {id:"JE101",entityId:"E002",period:"Sep 2024",date:"2024-09-30",ref:"SLS-101",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"SGD",amount:30000,icEntityId:null},
  {id:"JE102",entityId:"E002",period:"Sep 2024",date:"2024-09-30",ref:"PAY-102",description:"Staff costs Sep 2024",drAccount:"5100",crAccount:"2000",currency:"SGD",amount:12600,icEntityId:null},
  {id:"JE103",entityId:"E002",period:"Sep 2024",date:"2024-09-30",ref:"ADM-103",description:"Admin & office Sep 2024",drAccount:"5400",crAccount:"2000",currency:"SGD",amount:3900,icEntityId:null},
  {id:"JE104",entityId:"E002",period:"Sep 2024",date:"2024-09-30",ref:"DEP-104",description:"Depreciation Sep 2024",drAccount:"5300",crAccount:"1500",currency:"SGD",amount:1500,icEntityId:null},
  {id:"JE105",entityId:"E002",period:"Sep 2024",date:"2024-09-30",ref:"COS-105",description:"Cost of delivery Sep 2024",drAccount:"5000",crAccount:"2000",currency:"SGD",amount:5400,icEntityId:null},
  {id:"JE106",entityId:"E002",period:"Oct 2024",date:"2024-10-31",ref:"SLS-106",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"SGD",amount:28000,icEntityId:null},
  {id:"JE107",entityId:"E002",period:"Oct 2024",date:"2024-10-31",ref:"PAY-107",description:"Staff costs Oct 2024",drAccount:"5100",crAccount:"2000",currency:"SGD",amount:11760,icEntityId:null},
  {id:"JE108",entityId:"E002",period:"Oct 2024",date:"2024-10-31",ref:"ADM-108",description:"Admin & office Oct 2024",drAccount:"5400",crAccount:"2000",currency:"SGD",amount:3640,icEntityId:null},
  {id:"JE109",entityId:"E002",period:"Oct 2024",date:"2024-10-31",ref:"DEP-109",description:"Depreciation Oct 2024",drAccount:"5300",crAccount:"1500",currency:"SGD",amount:1400,icEntityId:null},
  {id:"JE110",entityId:"E002",period:"Oct 2024",date:"2024-10-31",ref:"COS-110",description:"Cost of delivery Oct 2024",drAccount:"5000",crAccount:"2000",currency:"SGD",amount:5040,icEntityId:null},
  {id:"JE111",entityId:"E002",period:"Nov 2024",date:"2024-11-30",ref:"SLS-111",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"SGD",amount:21000,icEntityId:null},
  {id:"JE112",entityId:"E002",period:"Nov 2024",date:"2024-11-30",ref:"PAY-112",description:"Staff costs Nov 2024",drAccount:"5100",crAccount:"2000",currency:"SGD",amount:8820,icEntityId:null},
  {id:"JE113",entityId:"E002",period:"Nov 2024",date:"2024-11-30",ref:"ADM-113",description:"Admin & office Nov 2024",drAccount:"5400",crAccount:"2000",currency:"SGD",amount:2730,icEntityId:null},
  {id:"JE114",entityId:"E002",period:"Nov 2024",date:"2024-11-30",ref:"DEP-114",description:"Depreciation Nov 2024",drAccount:"5300",crAccount:"1500",currency:"SGD",amount:1050,icEntityId:null},
  {id:"JE115",entityId:"E002",period:"Nov 2024",date:"2024-11-30",ref:"COS-115",description:"Cost of delivery Nov 2024",drAccount:"5000",crAccount:"2000",currency:"SGD",amount:3780,icEntityId:null},
  {id:"JE116",entityId:"E002",period:"Dec 2024",date:"2024-12-31",ref:"SLS-116",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"SGD",amount:28000,icEntityId:null},
  {id:"JE117",entityId:"E002",period:"Dec 2024",date:"2024-12-31",ref:"PAY-117",description:"Staff costs Dec 2024",drAccount:"5100",crAccount:"2000",currency:"SGD",amount:11760,icEntityId:null},
  {id:"JE118",entityId:"E002",period:"Dec 2024",date:"2024-12-31",ref:"ADM-118",description:"Admin & office Dec 2024",drAccount:"5400",crAccount:"2000",currency:"SGD",amount:3640,icEntityId:null},
  {id:"JE119",entityId:"E002",period:"Dec 2024",date:"2024-12-31",ref:"DEP-119",description:"Depreciation Dec 2024",drAccount:"5300",crAccount:"1500",currency:"SGD",amount:1400,icEntityId:null},
  {id:"JE120",entityId:"E002",period:"Dec 2024",date:"2024-12-31",ref:"COS-120",description:"Cost of delivery Dec 2024",drAccount:"5000",crAccount:"2000",currency:"SGD",amount:5040,icEntityId:null},
  {id:"JE121",entityId:"E003",period:"Jan 2024",date:"2024-01-31",ref:"SLS-121",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"PHP",amount:580000,icEntityId:null},
  {id:"JE122",entityId:"E003",period:"Jan 2024",date:"2024-01-31",ref:"PAY-122",description:"Staff costs Jan 2024",drAccount:"5100",crAccount:"2000",currency:"PHP",amount:243600,icEntityId:null},
  {id:"JE123",entityId:"E003",period:"Jan 2024",date:"2024-01-31",ref:"ADM-123",description:"Admin & office Jan 2024",drAccount:"5400",crAccount:"2000",currency:"PHP",amount:75400,icEntityId:null},
  {id:"JE124",entityId:"E003",period:"Jan 2024",date:"2024-01-31",ref:"DEP-124",description:"Depreciation Jan 2024",drAccount:"5300",crAccount:"1500",currency:"PHP",amount:29000,icEntityId:null},
  {id:"JE125",entityId:"E003",period:"Jan 2024",date:"2024-01-31",ref:"COS-125",description:"Cost of delivery Jan 2024",drAccount:"5000",crAccount:"2000",currency:"PHP",amount:104400,icEntityId:null},
  {id:"JE126",entityId:"E003",period:"Feb 2024",date:"2024-02-29",ref:"SLS-126",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"PHP",amount:620000,icEntityId:null},
  {id:"JE127",entityId:"E003",period:"Feb 2024",date:"2024-02-29",ref:"PAY-127",description:"Staff costs Feb 2024",drAccount:"5100",crAccount:"2000",currency:"PHP",amount:260400,icEntityId:null},
  {id:"JE128",entityId:"E003",period:"Feb 2024",date:"2024-02-29",ref:"ADM-128",description:"Admin & office Feb 2024",drAccount:"5400",crAccount:"2000",currency:"PHP",amount:80600,icEntityId:null},
  {id:"JE129",entityId:"E003",period:"Feb 2024",date:"2024-02-29",ref:"DEP-129",description:"Depreciation Feb 2024",drAccount:"5300",crAccount:"1500",currency:"PHP",amount:31000,icEntityId:null},
  {id:"JE130",entityId:"E003",period:"Feb 2024",date:"2024-02-29",ref:"COS-130",description:"Cost of delivery Feb 2024",drAccount:"5000",crAccount:"2000",currency:"PHP",amount:111600,icEntityId:null},
  {id:"JE131",entityId:"E003",period:"Mar 2024",date:"2024-03-31",ref:"SLS-131",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"PHP",amount:710000,icEntityId:null},
  {id:"JE132",entityId:"E003",period:"Mar 2024",date:"2024-03-31",ref:"PAY-132",description:"Staff costs Mar 2024",drAccount:"5100",crAccount:"2000",currency:"PHP",amount:298200,icEntityId:null},
  {id:"JE133",entityId:"E003",period:"Mar 2024",date:"2024-03-31",ref:"ADM-133",description:"Admin & office Mar 2024",drAccount:"5400",crAccount:"2000",currency:"PHP",amount:92300,icEntityId:null},
  {id:"JE134",entityId:"E003",period:"Mar 2024",date:"2024-03-31",ref:"DEP-134",description:"Depreciation Mar 2024",drAccount:"5300",crAccount:"1500",currency:"PHP",amount:35500,icEntityId:null},
  {id:"JE135",entityId:"E003",period:"Mar 2024",date:"2024-03-31",ref:"COS-135",description:"Cost of delivery Mar 2024",drAccount:"5000",crAccount:"2000",currency:"PHP",amount:127800,icEntityId:null},
  {id:"JE136",entityId:"E003",period:"Apr 2024",date:"2024-04-30",ref:"SLS-136",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"PHP",amount:680000,icEntityId:null},
  {id:"JE137",entityId:"E003",period:"Apr 2024",date:"2024-04-30",ref:"PAY-137",description:"Staff costs Apr 2024",drAccount:"5100",crAccount:"2000",currency:"PHP",amount:285600,icEntityId:null},
  {id:"JE138",entityId:"E003",period:"Apr 2024",date:"2024-04-30",ref:"ADM-138",description:"Admin & office Apr 2024",drAccount:"5400",crAccount:"2000",currency:"PHP",amount:88400,icEntityId:null},
  {id:"JE139",entityId:"E003",period:"Apr 2024",date:"2024-04-30",ref:"DEP-139",description:"Depreciation Apr 2024",drAccount:"5300",crAccount:"1500",currency:"PHP",amount:34000,icEntityId:null},
  {id:"JE140",entityId:"E003",period:"Apr 2024",date:"2024-04-30",ref:"COS-140",description:"Cost of delivery Apr 2024",drAccount:"5000",crAccount:"2000",currency:"PHP",amount:122400,icEntityId:null},
  {id:"JE141",entityId:"E003",period:"May 2024",date:"2024-05-31",ref:"SLS-141",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"PHP",amount:750000,icEntityId:null},
  {id:"JE142",entityId:"E003",period:"May 2024",date:"2024-05-31",ref:"PAY-142",description:"Staff costs May 2024",drAccount:"5100",crAccount:"2000",currency:"PHP",amount:315000,icEntityId:null},
  {id:"JE143",entityId:"E003",period:"May 2024",date:"2024-05-31",ref:"ADM-143",description:"Admin & office May 2024",drAccount:"5400",crAccount:"2000",currency:"PHP",amount:97500,icEntityId:null},
  {id:"JE144",entityId:"E003",period:"May 2024",date:"2024-05-31",ref:"DEP-144",description:"Depreciation May 2024",drAccount:"5300",crAccount:"1500",currency:"PHP",amount:37500,icEntityId:null},
  {id:"JE145",entityId:"E003",period:"May 2024",date:"2024-05-31",ref:"COS-145",description:"Cost of delivery May 2024",drAccount:"5000",crAccount:"2000",currency:"PHP",amount:135000,icEntityId:null},
  {id:"JE146",entityId:"E003",period:"Jun 2024",date:"2024-06-30",ref:"SLS-146",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"PHP",amount:820000,icEntityId:null},
  {id:"JE147",entityId:"E003",period:"Jun 2024",date:"2024-06-30",ref:"PAY-147",description:"Staff costs Jun 2024",drAccount:"5100",crAccount:"2000",currency:"PHP",amount:344400,icEntityId:null},
  {id:"JE148",entityId:"E003",period:"Jun 2024",date:"2024-06-30",ref:"ADM-148",description:"Admin & office Jun 2024",drAccount:"5400",crAccount:"2000",currency:"PHP",amount:106600,icEntityId:null},
  {id:"JE149",entityId:"E003",period:"Jun 2024",date:"2024-06-30",ref:"DEP-149",description:"Depreciation Jun 2024",drAccount:"5300",crAccount:"1500",currency:"PHP",amount:41000,icEntityId:null},
  {id:"JE150",entityId:"E003",period:"Jun 2024",date:"2024-06-30",ref:"COS-150",description:"Cost of delivery Jun 2024",drAccount:"5000",crAccount:"2000",currency:"PHP",amount:147600,icEntityId:null},
  {id:"JE151",entityId:"E003",period:"Jul 2024",date:"2024-07-31",ref:"SLS-151",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"PHP",amount:760000,icEntityId:null},
  {id:"JE152",entityId:"E003",period:"Jul 2024",date:"2024-07-31",ref:"PAY-152",description:"Staff costs Jul 2024",drAccount:"5100",crAccount:"2000",currency:"PHP",amount:319200,icEntityId:null},
  {id:"JE153",entityId:"E003",period:"Jul 2024",date:"2024-07-31",ref:"ADM-153",description:"Admin & office Jul 2024",drAccount:"5400",crAccount:"2000",currency:"PHP",amount:98800,icEntityId:null},
  {id:"JE154",entityId:"E003",period:"Jul 2024",date:"2024-07-31",ref:"DEP-154",description:"Depreciation Jul 2024",drAccount:"5300",crAccount:"1500",currency:"PHP",amount:38000,icEntityId:null},
  {id:"JE155",entityId:"E003",period:"Jul 2024",date:"2024-07-31",ref:"COS-155",description:"Cost of delivery Jul 2024",drAccount:"5000",crAccount:"2000",currency:"PHP",amount:136800,icEntityId:null},
  {id:"JE156",entityId:"E003",period:"Aug 2024",date:"2024-08-31",ref:"SLS-156",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"PHP",amount:800000,icEntityId:null},
  {id:"JE157",entityId:"E003",period:"Aug 2024",date:"2024-08-31",ref:"PAY-157",description:"Staff costs Aug 2024",drAccount:"5100",crAccount:"2000",currency:"PHP",amount:336000,icEntityId:null},
  {id:"JE158",entityId:"E003",period:"Aug 2024",date:"2024-08-31",ref:"ADM-158",description:"Admin & office Aug 2024",drAccount:"5400",crAccount:"2000",currency:"PHP",amount:104000,icEntityId:null},
  {id:"JE159",entityId:"E003",period:"Aug 2024",date:"2024-08-31",ref:"DEP-159",description:"Depreciation Aug 2024",drAccount:"5300",crAccount:"1500",currency:"PHP",amount:40000,icEntityId:null},
  {id:"JE160",entityId:"E003",period:"Aug 2024",date:"2024-08-31",ref:"COS-160",description:"Cost of delivery Aug 2024",drAccount:"5000",crAccount:"2000",currency:"PHP",amount:144000,icEntityId:null},
  {id:"JE161",entityId:"E003",period:"Sep 2024",date:"2024-09-30",ref:"SLS-161",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"PHP",amount:870000,icEntityId:null},
  {id:"JE162",entityId:"E003",period:"Sep 2024",date:"2024-09-30",ref:"PAY-162",description:"Staff costs Sep 2024",drAccount:"5100",crAccount:"2000",currency:"PHP",amount:365400,icEntityId:null},
  {id:"JE163",entityId:"E003",period:"Sep 2024",date:"2024-09-30",ref:"ADM-163",description:"Admin & office Sep 2024",drAccount:"5400",crAccount:"2000",currency:"PHP",amount:113100,icEntityId:null},
  {id:"JE164",entityId:"E003",period:"Sep 2024",date:"2024-09-30",ref:"DEP-164",description:"Depreciation Sep 2024",drAccount:"5300",crAccount:"1500",currency:"PHP",amount:43500,icEntityId:null},
  {id:"JE165",entityId:"E003",period:"Sep 2024",date:"2024-09-30",ref:"COS-165",description:"Cost of delivery Sep 2024",drAccount:"5000",crAccount:"2000",currency:"PHP",amount:156600,icEntityId:null},
  {id:"JE166",entityId:"E003",period:"Oct 2024",date:"2024-10-31",ref:"SLS-166",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"PHP",amount:840000,icEntityId:null},
  {id:"JE167",entityId:"E003",period:"Oct 2024",date:"2024-10-31",ref:"PAY-167",description:"Staff costs Oct 2024",drAccount:"5100",crAccount:"2000",currency:"PHP",amount:352800,icEntityId:null},
  {id:"JE168",entityId:"E003",period:"Oct 2024",date:"2024-10-31",ref:"ADM-168",description:"Admin & office Oct 2024",drAccount:"5400",crAccount:"2000",currency:"PHP",amount:109200,icEntityId:null},
  {id:"JE169",entityId:"E003",period:"Oct 2024",date:"2024-10-31",ref:"DEP-169",description:"Depreciation Oct 2024",drAccount:"5300",crAccount:"1500",currency:"PHP",amount:42000,icEntityId:null},
  {id:"JE170",entityId:"E003",period:"Oct 2024",date:"2024-10-31",ref:"COS-170",description:"Cost of delivery Oct 2024",drAccount:"5000",crAccount:"2000",currency:"PHP",amount:151200,icEntityId:null},
  {id:"JE171",entityId:"E003",period:"Nov 2024",date:"2024-11-30",ref:"SLS-171",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"PHP",amount:720000,icEntityId:null},
  {id:"JE172",entityId:"E003",period:"Nov 2024",date:"2024-11-30",ref:"PAY-172",description:"Staff costs Nov 2024",drAccount:"5100",crAccount:"2000",currency:"PHP",amount:302400,icEntityId:null},
  {id:"JE173",entityId:"E003",period:"Nov 2024",date:"2024-11-30",ref:"ADM-173",description:"Admin & office Nov 2024",drAccount:"5400",crAccount:"2000",currency:"PHP",amount:93600,icEntityId:null},
  {id:"JE174",entityId:"E003",period:"Nov 2024",date:"2024-11-30",ref:"DEP-174",description:"Depreciation Nov 2024",drAccount:"5300",crAccount:"1500",currency:"PHP",amount:36000,icEntityId:null},
  {id:"JE175",entityId:"E003",period:"Nov 2024",date:"2024-11-30",ref:"COS-175",description:"Cost of delivery Nov 2024",drAccount:"5000",crAccount:"2000",currency:"PHP",amount:129600,icEntityId:null},
  {id:"JE176",entityId:"E003",period:"Dec 2024",date:"2024-12-31",ref:"SLS-176",description:"Revenue — external clients",drAccount:"1100",crAccount:"4000",currency:"PHP",amount:850000,icEntityId:null},
  {id:"JE177",entityId:"E003",period:"Dec 2024",date:"2024-12-31",ref:"PAY-177",description:"Staff costs Dec 2024",drAccount:"5100",crAccount:"2000",currency:"PHP",amount:357000,icEntityId:null},
  {id:"JE178",entityId:"E003",period:"Dec 2024",date:"2024-12-31",ref:"ADM-178",description:"Admin & office Dec 2024",drAccount:"5400",crAccount:"2000",currency:"PHP",amount:110500,icEntityId:null},
  {id:"JE179",entityId:"E003",period:"Dec 2024",date:"2024-12-31",ref:"DEP-179",description:"Depreciation Dec 2024",drAccount:"5300",crAccount:"1500",currency:"PHP",amount:42500,icEntityId:null},
  {id:"JE180",entityId:"E003",period:"Dec 2024",date:"2024-12-31",ref:"COS-180",description:"Cost of delivery Dec 2024",drAccount:"5000",crAccount:"2000",currency:"PHP",amount:153000,icEntityId:null},
  {id:"JE181",entityId:"E001",period:"Jan 2024",date:"2024-01-31",ref:"IC-181",description:"IC mgmt fee to SG Jan 2024",drAccount:"1150",crAccount:"4100",currency:"MYR",amount:18000,icEntityId:"E002"},
  {id:"JE182",entityId:"E002",period:"Jan 2024",date:"2024-01-31",ref:"IC-182",description:"IC mgmt fee payable to HQ Jan 2024",drAccount:"5200",crAccount:"2050",currency:"SGD",amount:5100,icEntityId:"E001"},
  {id:"JE183",entityId:"E001",period:"Feb 2024",date:"2024-02-29",ref:"IC-183",description:"IC mgmt fee to SG Feb 2024",drAccount:"1150",crAccount:"4100",currency:"MYR",amount:18000,icEntityId:"E002"},
  {id:"JE184",entityId:"E002",period:"Feb 2024",date:"2024-02-29",ref:"IC-184",description:"IC mgmt fee payable to HQ Feb 2024",drAccount:"5200",crAccount:"2050",currency:"SGD",amount:5100,icEntityId:"E001"},
  {id:"JE185",entityId:"E001",period:"Mar 2024",date:"2024-03-31",ref:"IC-185",description:"IC mgmt fee to SG Mar 2024",drAccount:"1150",crAccount:"4100",currency:"MYR",amount:20000,icEntityId:"E002"},
  {id:"JE186",entityId:"E002",period:"Mar 2024",date:"2024-03-31",ref:"IC-186",description:"IC mgmt fee payable to HQ Mar 2024",drAccount:"5200",crAccount:"2050",currency:"SGD",amount:5680,icEntityId:"E001"},
  {id:"JE187",entityId:"E001",period:"Apr 2024",date:"2024-04-30",ref:"IC-187",description:"IC mgmt fee to SG Apr 2024",drAccount:"1150",crAccount:"4100",currency:"MYR",amount:18000,icEntityId:"E002"},
  {id:"JE188",entityId:"E002",period:"Apr 2024",date:"2024-04-30",ref:"IC-188",description:"IC mgmt fee payable to HQ Apr 2024",drAccount:"5200",crAccount:"2050",currency:"SGD",amount:5100,icEntityId:"E001"},
  {id:"JE189",entityId:"E001",period:"May 2024",date:"2024-05-31",ref:"IC-189",description:"IC mgmt fee to SG May 2024",drAccount:"1150",crAccount:"4100",currency:"MYR",amount:22000,icEntityId:"E002"},
  {id:"JE190",entityId:"E002",period:"May 2024",date:"2024-05-31",ref:"IC-190",description:"IC mgmt fee payable to HQ May 2024",drAccount:"5200",crAccount:"2050",currency:"SGD",amount:6250,icEntityId:"E001"},
  {id:"JE191",entityId:"E001",period:"Jun 2024",date:"2024-06-30",ref:"IC-191",description:"IC mgmt fee to SG Jun 2024",drAccount:"1150",crAccount:"4100",currency:"MYR",amount:22000,icEntityId:"E002"},
  {id:"JE192",entityId:"E002",period:"Jun 2024",date:"2024-06-30",ref:"IC-192",description:"IC mgmt fee payable to HQ Jun 2024",drAccount:"5200",crAccount:"2050",currency:"SGD",amount:6250,icEntityId:"E001"},
  {id:"JE193",entityId:"E001",period:"Jul 2024",date:"2024-07-31",ref:"IC-193",description:"IC mgmt fee to SG Jul 2024",drAccount:"1150",crAccount:"4100",currency:"MYR",amount:20000,icEntityId:"E002"},
  {id:"JE194",entityId:"E002",period:"Jul 2024",date:"2024-07-31",ref:"IC-194",description:"IC mgmt fee payable to HQ Jul 2024",drAccount:"5200",crAccount:"2050",currency:"SGD",amount:5680,icEntityId:"E001"},
  {id:"JE195",entityId:"E001",period:"Aug 2024",date:"2024-08-31",ref:"IC-195",description:"IC mgmt fee to SG Aug 2024",drAccount:"1150",crAccount:"4100",currency:"MYR",amount:22000,icEntityId:"E002"},
  {id:"JE196",entityId:"E002",period:"Aug 2024",date:"2024-08-31",ref:"IC-196",description:"IC mgmt fee payable to HQ Aug 2024",drAccount:"5200",crAccount:"2050",currency:"SGD",amount:6250,icEntityId:"E001"},
  {id:"JE197",entityId:"E001",period:"Sep 2024",date:"2024-09-30",ref:"IC-197",description:"IC mgmt fee to SG Sep 2024",drAccount:"1150",crAccount:"4100",currency:"MYR",amount:24000,icEntityId:"E002"},
  {id:"JE198",entityId:"E002",period:"Sep 2024",date:"2024-09-30",ref:"IC-198",description:"IC mgmt fee payable to HQ Sep 2024",drAccount:"5200",crAccount:"2050",currency:"SGD",amount:6820,icEntityId:"E001"},
  {id:"JE199",entityId:"E001",period:"Oct 2024",date:"2024-10-31",ref:"IC-199",description:"IC mgmt fee to SG Oct 2024",drAccount:"1150",crAccount:"4100",currency:"MYR",amount:22000,icEntityId:"E002"},
  {id:"JE200",entityId:"E002",period:"Oct 2024",date:"2024-10-31",ref:"IC-200",description:"IC mgmt fee payable to HQ Oct 2024",drAccount:"5200",crAccount:"2050",currency:"SGD",amount:6250,icEntityId:"E001"},
  {id:"JE201",entityId:"E001",period:"Nov 2024",date:"2024-11-30",ref:"IC-201",description:"IC mgmt fee to SG Nov 2024",drAccount:"1150",crAccount:"4100",currency:"MYR",amount:22000,icEntityId:"E002"},
  {id:"JE202",entityId:"E002",period:"Nov 2024",date:"2024-11-30",ref:"IC-202",description:"IC mgmt fee payable to HQ Nov 2024",drAccount:"5200",crAccount:"2050",currency:"SGD",amount:6250,icEntityId:"E001"},
  {id:"JE203",entityId:"E001",period:"Dec 2024",date:"2024-12-31",ref:"IC-203",description:"IC mgmt fee to SG Dec 2024",drAccount:"1150",crAccount:"4100",currency:"MYR",amount:22000,icEntityId:"E002"},
  {id:"JE204",entityId:"E002",period:"Dec 2024",date:"2024-12-31",ref:"IC-204",description:"IC mgmt fee payable to HQ Dec 2024",drAccount:"5200",crAccount:"2050",currency:"SGD",amount:6250,icEntityId:"E001"}
,
  {id:"JE0501",entityId:"E001",period:"Jan 2024",date:"2024-01-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"MYR",amount:40800,icEntityId:null},
  {id:"JE0502",entityId:"E001",period:"Jan 2024",date:"2024-01-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"MYR",amount:27200,icEntityId:null},
  {id:"JE0503",entityId:"E001",period:"Jan 2024",date:"2024-01-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"MYR",amount:14280,icEntityId:null},
  {id:"JE0504",entityId:"E001",period:"Jan 2024",date:"2024-01-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"MYR",amount:8568,icEntityId:null},
  {id:"JE0505",entityId:"E001",period:"Jan 2024",date:"2024-01-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"MYR",amount:4284,icEntityId:null},
  {id:"JE0506",entityId:"E001",period:"Jan 2024",date:"2024-01-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"MYR",amount:1428,icEntityId:null},
  {id:"JE0507",entityId:"E001",period:"Jan 2024",date:"2024-01-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"MYR",amount:5746,icEntityId:null},
  {id:"JE0508",entityId:"E001",period:"Jan 2024",date:"2024-01-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"MYR",amount:3094,icEntityId:null},
  {id:"JE0509",entityId:"E001",period:"Jan 2024",date:"2024-01-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"MYR",amount:3400,icEntityId:null},
  {id:"JE0510",entityId:"E001",period:"Jan 2024",date:"2024-01-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"MYR",amount:8568,icEntityId:null},
  {id:"JE0511",entityId:"E001",period:"Jan 2024",date:"2024-01-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"MYR",amount:3672,icEntityId:null},
  {id:"JE0512",entityId:"E001",period:"Feb 2024",date:"2024-02-29",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"MYR",amount:43200,icEntityId:null},
  {id:"JE0513",entityId:"E001",period:"Feb 2024",date:"2024-02-29",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"MYR",amount:28800,icEntityId:null},
  {id:"JE0514",entityId:"E001",period:"Feb 2024",date:"2024-02-29",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"MYR",amount:15120,icEntityId:null},
  {id:"JE0515",entityId:"E001",period:"Feb 2024",date:"2024-02-29",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"MYR",amount:9072,icEntityId:null},
  {id:"JE0516",entityId:"E001",period:"Feb 2024",date:"2024-02-29",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"MYR",amount:4536,icEntityId:null},
  {id:"JE0517",entityId:"E001",period:"Feb 2024",date:"2024-02-29",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"MYR",amount:1512,icEntityId:null},
  {id:"JE0518",entityId:"E001",period:"Feb 2024",date:"2024-02-29",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"MYR",amount:6084,icEntityId:null},
  {id:"JE0519",entityId:"E001",period:"Feb 2024",date:"2024-02-29",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"MYR",amount:3276,icEntityId:null},
  {id:"JE0520",entityId:"E001",period:"Feb 2024",date:"2024-02-29",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"MYR",amount:3600,icEntityId:null},
  {id:"JE0521",entityId:"E001",period:"Feb 2024",date:"2024-02-29",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"MYR",amount:9072,icEntityId:null},
  {id:"JE0522",entityId:"E001",period:"Feb 2024",date:"2024-02-29",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"MYR",amount:3888,icEntityId:null},
  {id:"JE0523",entityId:"E001",period:"Mar 2024",date:"2024-03-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"MYR",amount:51000,icEntityId:null},
  {id:"JE0524",entityId:"E001",period:"Mar 2024",date:"2024-03-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"MYR",amount:34000,icEntityId:null},
  {id:"JE0525",entityId:"E001",period:"Mar 2024",date:"2024-03-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"MYR",amount:17850,icEntityId:null},
  {id:"JE0526",entityId:"E001",period:"Mar 2024",date:"2024-03-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"MYR",amount:10710,icEntityId:null},
  {id:"JE0527",entityId:"E001",period:"Mar 2024",date:"2024-03-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"MYR",amount:5355,icEntityId:null},
  {id:"JE0528",entityId:"E001",period:"Mar 2024",date:"2024-03-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"MYR",amount:1785,icEntityId:null},
  {id:"JE0529",entityId:"E001",period:"Mar 2024",date:"2024-03-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"MYR",amount:7182,icEntityId:null},
  {id:"JE0530",entityId:"E001",period:"Mar 2024",date:"2024-03-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"MYR",amount:3868,icEntityId:null},
  {id:"JE0531",entityId:"E001",period:"Mar 2024",date:"2024-03-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"MYR",amount:4250,icEntityId:null},
  {id:"JE0532",entityId:"E001",period:"Mar 2024",date:"2024-03-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"MYR",amount:10710,icEntityId:null},
  {id:"JE0533",entityId:"E001",period:"Mar 2024",date:"2024-03-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"MYR",amount:4590,icEntityId:null},
  {id:"JE0534",entityId:"E001",period:"Apr 2024",date:"2024-04-30",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"MYR",amount:46800,icEntityId:null},
  {id:"JE0535",entityId:"E001",period:"Apr 2024",date:"2024-04-30",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"MYR",amount:31200,icEntityId:null},
  {id:"JE0536",entityId:"E001",period:"Apr 2024",date:"2024-04-30",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"MYR",amount:16380,icEntityId:null},
  {id:"JE0537",entityId:"E001",period:"Apr 2024",date:"2024-04-30",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"MYR",amount:9828,icEntityId:null},
  {id:"JE0538",entityId:"E001",period:"Apr 2024",date:"2024-04-30",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"MYR",amount:4914,icEntityId:null},
  {id:"JE0539",entityId:"E001",period:"Apr 2024",date:"2024-04-30",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"MYR",amount:1638,icEntityId:null},
  {id:"JE0540",entityId:"E001",period:"Apr 2024",date:"2024-04-30",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"MYR",amount:6591,icEntityId:null},
  {id:"JE0541",entityId:"E001",period:"Apr 2024",date:"2024-04-30",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"MYR",amount:3549,icEntityId:null},
  {id:"JE0542",entityId:"E001",period:"Apr 2024",date:"2024-04-30",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"MYR",amount:3900,icEntityId:null},
  {id:"JE0543",entityId:"E001",period:"Apr 2024",date:"2024-04-30",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"MYR",amount:9828,icEntityId:null},
  {id:"JE0544",entityId:"E001",period:"Apr 2024",date:"2024-04-30",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"MYR",amount:4212,icEntityId:null},
  {id:"JE0545",entityId:"E001",period:"May 2024",date:"2024-05-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"MYR",amount:55200,icEntityId:null},
  {id:"JE0546",entityId:"E001",period:"May 2024",date:"2024-05-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"MYR",amount:36800,icEntityId:null},
  {id:"JE0547",entityId:"E001",period:"May 2024",date:"2024-05-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"MYR",amount:19320,icEntityId:null},
  {id:"JE0548",entityId:"E001",period:"May 2024",date:"2024-05-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"MYR",amount:11592,icEntityId:null},
  {id:"JE0549",entityId:"E001",period:"May 2024",date:"2024-05-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"MYR",amount:5796,icEntityId:null},
  {id:"JE0550",entityId:"E001",period:"May 2024",date:"2024-05-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"MYR",amount:1932,icEntityId:null},
  {id:"JE0551",entityId:"E001",period:"May 2024",date:"2024-05-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"MYR",amount:7774,icEntityId:null},
  {id:"JE0552",entityId:"E001",period:"May 2024",date:"2024-05-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"MYR",amount:4186,icEntityId:null},
  {id:"JE0553",entityId:"E001",period:"May 2024",date:"2024-05-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"MYR",amount:4600,icEntityId:null},
  {id:"JE0554",entityId:"E001",period:"May 2024",date:"2024-05-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"MYR",amount:11592,icEntityId:null},
  {id:"JE0555",entityId:"E001",period:"May 2024",date:"2024-05-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"MYR",amount:4968,icEntityId:null},
  {id:"JE0556",entityId:"E001",period:"Jun 2024",date:"2024-06-30",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"MYR",amount:63000,icEntityId:null},
  {id:"JE0557",entityId:"E001",period:"Jun 2024",date:"2024-06-30",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"MYR",amount:42000,icEntityId:null},
  {id:"JE0558",entityId:"E001",period:"Jun 2024",date:"2024-06-30",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"MYR",amount:22050,icEntityId:null},
  {id:"JE0559",entityId:"E001",period:"Jun 2024",date:"2024-06-30",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"MYR",amount:13230,icEntityId:null},
  {id:"JE0560",entityId:"E001",period:"Jun 2024",date:"2024-06-30",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"MYR",amount:6615,icEntityId:null},
  {id:"JE0561",entityId:"E001",period:"Jun 2024",date:"2024-06-30",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"MYR",amount:2205,icEntityId:null},
  {id:"JE0562",entityId:"E001",period:"Jun 2024",date:"2024-06-30",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"MYR",amount:8872,icEntityId:null},
  {id:"JE0563",entityId:"E001",period:"Jun 2024",date:"2024-06-30",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"MYR",amount:4778,icEntityId:null},
  {id:"JE0564",entityId:"E001",period:"Jun 2024",date:"2024-06-30",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"MYR",amount:5250,icEntityId:null},
  {id:"JE0565",entityId:"E001",period:"Jun 2024",date:"2024-06-30",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"MYR",amount:13230,icEntityId:null},
  {id:"JE0566",entityId:"E001",period:"Jun 2024",date:"2024-06-30",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"MYR",amount:5670,icEntityId:null},
  {id:"JE0567",entityId:"E001",period:"Jul 2024",date:"2024-07-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"MYR",amount:52800,icEntityId:null},
  {id:"JE0568",entityId:"E001",period:"Jul 2024",date:"2024-07-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"MYR",amount:35200,icEntityId:null},
  {id:"JE0569",entityId:"E001",period:"Jul 2024",date:"2024-07-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"MYR",amount:18480,icEntityId:null},
  {id:"JE0570",entityId:"E001",period:"Jul 2024",date:"2024-07-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"MYR",amount:11088,icEntityId:null},
  {id:"JE0571",entityId:"E001",period:"Jul 2024",date:"2024-07-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"MYR",amount:5544,icEntityId:null},
  {id:"JE0572",entityId:"E001",period:"Jul 2024",date:"2024-07-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"MYR",amount:1848,icEntityId:null},
  {id:"JE0573",entityId:"E001",period:"Jul 2024",date:"2024-07-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"MYR",amount:7436,icEntityId:null},
  {id:"JE0574",entityId:"E001",period:"Jul 2024",date:"2024-07-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"MYR",amount:4004,icEntityId:null},
  {id:"JE0575",entityId:"E001",period:"Jul 2024",date:"2024-07-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"MYR",amount:4400,icEntityId:null},
  {id:"JE0576",entityId:"E001",period:"Jul 2024",date:"2024-07-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"MYR",amount:11088,icEntityId:null},
  {id:"JE0577",entityId:"E001",period:"Jul 2024",date:"2024-07-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"MYR",amount:4752,icEntityId:null},
  {id:"JE0578",entityId:"E001",period:"Aug 2024",date:"2024-08-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"MYR",amount:57000,icEntityId:null},
  {id:"JE0579",entityId:"E001",period:"Aug 2024",date:"2024-08-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"MYR",amount:38000,icEntityId:null},
  {id:"JE0580",entityId:"E001",period:"Aug 2024",date:"2024-08-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"MYR",amount:19950,icEntityId:null},
  {id:"JE0581",entityId:"E001",period:"Aug 2024",date:"2024-08-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"MYR",amount:11970,icEntityId:null},
  {id:"JE0582",entityId:"E001",period:"Aug 2024",date:"2024-08-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"MYR",amount:5985,icEntityId:null},
  {id:"JE0583",entityId:"E001",period:"Aug 2024",date:"2024-08-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"MYR",amount:1995,icEntityId:null},
  {id:"JE0584",entityId:"E001",period:"Aug 2024",date:"2024-08-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"MYR",amount:8028,icEntityId:null},
  {id:"JE0585",entityId:"E001",period:"Aug 2024",date:"2024-08-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"MYR",amount:4322,icEntityId:null},
  {id:"JE0586",entityId:"E001",period:"Aug 2024",date:"2024-08-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"MYR",amount:4750,icEntityId:null},
  {id:"JE0587",entityId:"E001",period:"Aug 2024",date:"2024-08-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"MYR",amount:11970,icEntityId:null},
  {id:"JE0588",entityId:"E001",period:"Aug 2024",date:"2024-08-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"MYR",amount:5130,icEntityId:null},
  {id:"JE0589",entityId:"E001",period:"Sep 2024",date:"2024-09-30",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"MYR",amount:66000,icEntityId:null},
  {id:"JE0590",entityId:"E001",period:"Sep 2024",date:"2024-09-30",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"MYR",amount:44000,icEntityId:null},
  {id:"JE0591",entityId:"E001",period:"Sep 2024",date:"2024-09-30",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"MYR",amount:23100,icEntityId:null},
  {id:"JE0592",entityId:"E001",period:"Sep 2024",date:"2024-09-30",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"MYR",amount:13860,icEntityId:null},
  {id:"JE0593",entityId:"E001",period:"Sep 2024",date:"2024-09-30",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"MYR",amount:6930,icEntityId:null},
  {id:"JE0594",entityId:"E001",period:"Sep 2024",date:"2024-09-30",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"MYR",amount:2310,icEntityId:null},
  {id:"JE0595",entityId:"E001",period:"Sep 2024",date:"2024-09-30",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"MYR",amount:9295,icEntityId:null},
  {id:"JE0596",entityId:"E001",period:"Sep 2024",date:"2024-09-30",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"MYR",amount:5005,icEntityId:null},
  {id:"JE0597",entityId:"E001",period:"Sep 2024",date:"2024-09-30",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"MYR",amount:5500,icEntityId:null},
  {id:"JE0598",entityId:"E001",period:"Sep 2024",date:"2024-09-30",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"MYR",amount:13860,icEntityId:null},
  {id:"JE0599",entityId:"E001",period:"Sep 2024",date:"2024-09-30",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"MYR",amount:5940,icEntityId:null},
  {id:"JE0600",entityId:"E001",period:"Oct 2024",date:"2024-10-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"MYR",amount:61200,icEntityId:null},
  {id:"JE0601",entityId:"E001",period:"Oct 2024",date:"2024-10-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"MYR",amount:40800,icEntityId:null},
  {id:"JE0602",entityId:"E001",period:"Oct 2024",date:"2024-10-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"MYR",amount:21420,icEntityId:null},
  {id:"JE0603",entityId:"E001",period:"Oct 2024",date:"2024-10-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"MYR",amount:12852,icEntityId:null},
  {id:"JE0604",entityId:"E001",period:"Oct 2024",date:"2024-10-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"MYR",amount:6426,icEntityId:null},
  {id:"JE0605",entityId:"E001",period:"Oct 2024",date:"2024-10-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"MYR",amount:2142,icEntityId:null},
  {id:"JE0606",entityId:"E001",period:"Oct 2024",date:"2024-10-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"MYR",amount:8619,icEntityId:null},
  {id:"JE0607",entityId:"E001",period:"Oct 2024",date:"2024-10-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"MYR",amount:4641,icEntityId:null},
  {id:"JE0608",entityId:"E001",period:"Oct 2024",date:"2024-10-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"MYR",amount:5100,icEntityId:null},
  {id:"JE0609",entityId:"E001",period:"Oct 2024",date:"2024-10-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"MYR",amount:12852,icEntityId:null},
  {id:"JE0610",entityId:"E001",period:"Oct 2024",date:"2024-10-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"MYR",amount:5508,icEntityId:null},
  {id:"JE0611",entityId:"E001",period:"Nov 2024",date:"2024-11-30",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"MYR",amount:46800,icEntityId:null},
  {id:"JE0612",entityId:"E001",period:"Nov 2024",date:"2024-11-30",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"MYR",amount:31200,icEntityId:null},
  {id:"JE0613",entityId:"E001",period:"Nov 2024",date:"2024-11-30",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"MYR",amount:16380,icEntityId:null},
  {id:"JE0614",entityId:"E001",period:"Nov 2024",date:"2024-11-30",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"MYR",amount:9828,icEntityId:null},
  {id:"JE0615",entityId:"E001",period:"Nov 2024",date:"2024-11-30",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"MYR",amount:4914,icEntityId:null},
  {id:"JE0616",entityId:"E001",period:"Nov 2024",date:"2024-11-30",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"MYR",amount:1638,icEntityId:null},
  {id:"JE0617",entityId:"E001",period:"Nov 2024",date:"2024-11-30",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"MYR",amount:6591,icEntityId:null},
  {id:"JE0618",entityId:"E001",period:"Nov 2024",date:"2024-11-30",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"MYR",amount:3549,icEntityId:null},
  {id:"JE0619",entityId:"E001",period:"Nov 2024",date:"2024-11-30",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"MYR",amount:3900,icEntityId:null},
  {id:"JE0620",entityId:"E001",period:"Nov 2024",date:"2024-11-30",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"MYR",amount:9828,icEntityId:null},
  {id:"JE0621",entityId:"E001",period:"Nov 2024",date:"2024-11-30",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"MYR",amount:4212,icEntityId:null},
  {id:"JE0622",entityId:"E001",period:"Dec 2024",date:"2024-12-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"MYR",amount:57000,icEntityId:null},
  {id:"JE0623",entityId:"E001",period:"Dec 2024",date:"2024-12-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"MYR",amount:38000,icEntityId:null},
  {id:"JE0624",entityId:"E001",period:"Dec 2024",date:"2024-12-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"MYR",amount:19950,icEntityId:null},
  {id:"JE0625",entityId:"E001",period:"Dec 2024",date:"2024-12-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"MYR",amount:11970,icEntityId:null},
  {id:"JE0626",entityId:"E001",period:"Dec 2024",date:"2024-12-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"MYR",amount:5985,icEntityId:null},
  {id:"JE0627",entityId:"E001",period:"Dec 2024",date:"2024-12-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"MYR",amount:1995,icEntityId:null},
  {id:"JE0628",entityId:"E001",period:"Dec 2024",date:"2024-12-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"MYR",amount:8028,icEntityId:null},
  {id:"JE0629",entityId:"E001",period:"Dec 2024",date:"2024-12-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"MYR",amount:4322,icEntityId:null},
  {id:"JE0630",entityId:"E001",period:"Dec 2024",date:"2024-12-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"MYR",amount:4750,icEntityId:null},
  {id:"JE0631",entityId:"E001",period:"Dec 2024",date:"2024-12-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"MYR",amount:11970,icEntityId:null},
  {id:"JE0632",entityId:"E001",period:"Dec 2024",date:"2024-12-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"MYR",amount:5130,icEntityId:null},
  {id:"JE0633",entityId:"E002",period:"Jan 2024",date:"2024-01-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"SGD",amount:10800,icEntityId:null},
  {id:"JE0634",entityId:"E002",period:"Jan 2024",date:"2024-01-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"SGD",amount:7200,icEntityId:null},
  {id:"JE0635",entityId:"E002",period:"Jan 2024",date:"2024-01-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"SGD",amount:3780,icEntityId:null},
  {id:"JE0636",entityId:"E002",period:"Jan 2024",date:"2024-01-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"SGD",amount:2268,icEntityId:null},
  {id:"JE0637",entityId:"E002",period:"Jan 2024",date:"2024-01-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"SGD",amount:1134,icEntityId:null},
  {id:"JE0638",entityId:"E002",period:"Jan 2024",date:"2024-01-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"SGD",amount:378,icEntityId:null},
  {id:"JE0639",entityId:"E002",period:"Jan 2024",date:"2024-01-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"SGD",amount:1521,icEntityId:null},
  {id:"JE0640",entityId:"E002",period:"Jan 2024",date:"2024-01-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"SGD",amount:819,icEntityId:null},
  {id:"JE0641",entityId:"E002",period:"Jan 2024",date:"2024-01-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"SGD",amount:900,icEntityId:null},
  {id:"JE0642",entityId:"E002",period:"Jan 2024",date:"2024-01-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"SGD",amount:2268,icEntityId:null},
  {id:"JE0643",entityId:"E002",period:"Jan 2024",date:"2024-01-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"SGD",amount:972,icEntityId:null},
  {id:"JE0644",entityId:"E002",period:"Feb 2024",date:"2024-02-29",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"SGD",amount:11700,icEntityId:null},
  {id:"JE0645",entityId:"E002",period:"Feb 2024",date:"2024-02-29",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"SGD",amount:7800,icEntityId:null},
  {id:"JE0646",entityId:"E002",period:"Feb 2024",date:"2024-02-29",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"SGD",amount:4095,icEntityId:null},
  {id:"JE0647",entityId:"E002",period:"Feb 2024",date:"2024-02-29",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"SGD",amount:2457,icEntityId:null},
  {id:"JE0648",entityId:"E002",period:"Feb 2024",date:"2024-02-29",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"SGD",amount:1228,icEntityId:null},
  {id:"JE0649",entityId:"E002",period:"Feb 2024",date:"2024-02-29",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"SGD",amount:410,icEntityId:null},
  {id:"JE0650",entityId:"E002",period:"Feb 2024",date:"2024-02-29",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"SGD",amount:1648,icEntityId:null},
  {id:"JE0651",entityId:"E002",period:"Feb 2024",date:"2024-02-29",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"SGD",amount:887,icEntityId:null},
  {id:"JE0652",entityId:"E002",period:"Feb 2024",date:"2024-02-29",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"SGD",amount:975,icEntityId:null},
  {id:"JE0653",entityId:"E002",period:"Feb 2024",date:"2024-02-29",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"SGD",amount:2457,icEntityId:null},
  {id:"JE0654",entityId:"E002",period:"Feb 2024",date:"2024-02-29",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"SGD",amount:1053,icEntityId:null},
  {id:"JE0655",entityId:"E002",period:"Mar 2024",date:"2024-03-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"SGD",amount:13200,icEntityId:null},
  {id:"JE0656",entityId:"E002",period:"Mar 2024",date:"2024-03-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"SGD",amount:8800,icEntityId:null},
  {id:"JE0657",entityId:"E002",period:"Mar 2024",date:"2024-03-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"SGD",amount:4620,icEntityId:null},
  {id:"JE0658",entityId:"E002",period:"Mar 2024",date:"2024-03-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"SGD",amount:2772,icEntityId:null},
  {id:"JE0659",entityId:"E002",period:"Mar 2024",date:"2024-03-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"SGD",amount:1386,icEntityId:null},
  {id:"JE0660",entityId:"E002",period:"Mar 2024",date:"2024-03-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"SGD",amount:462,icEntityId:null},
  {id:"JE0661",entityId:"E002",period:"Mar 2024",date:"2024-03-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"SGD",amount:1859,icEntityId:null},
  {id:"JE0662",entityId:"E002",period:"Mar 2024",date:"2024-03-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"SGD",amount:1001,icEntityId:null},
  {id:"JE0663",entityId:"E002",period:"Mar 2024",date:"2024-03-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"SGD",amount:1100,icEntityId:null},
  {id:"JE0664",entityId:"E002",period:"Mar 2024",date:"2024-03-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"SGD",amount:2772,icEntityId:null},
  {id:"JE0665",entityId:"E002",period:"Mar 2024",date:"2024-03-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"SGD",amount:1188,icEntityId:null},
  {id:"JE0666",entityId:"E002",period:"Apr 2024",date:"2024-04-30",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"SGD",amount:12000,icEntityId:null},
  {id:"JE0667",entityId:"E002",period:"Apr 2024",date:"2024-04-30",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"SGD",amount:8000,icEntityId:null},
  {id:"JE0668",entityId:"E002",period:"Apr 2024",date:"2024-04-30",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"SGD",amount:4200,icEntityId:null},
  {id:"JE0669",entityId:"E002",period:"Apr 2024",date:"2024-04-30",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"SGD",amount:2520,icEntityId:null},
  {id:"JE0670",entityId:"E002",period:"Apr 2024",date:"2024-04-30",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"SGD",amount:1260,icEntityId:null},
  {id:"JE0671",entityId:"E002",period:"Apr 2024",date:"2024-04-30",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"SGD",amount:420,icEntityId:null},
  {id:"JE0672",entityId:"E002",period:"Apr 2024",date:"2024-04-30",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"SGD",amount:1690,icEntityId:null},
  {id:"JE0673",entityId:"E002",period:"Apr 2024",date:"2024-04-30",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"SGD",amount:910,icEntityId:null},
  {id:"JE0674",entityId:"E002",period:"Apr 2024",date:"2024-04-30",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"SGD",amount:1000,icEntityId:null},
  {id:"JE0675",entityId:"E002",period:"Apr 2024",date:"2024-04-30",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"SGD",amount:2520,icEntityId:null},
  {id:"JE0676",entityId:"E002",period:"Apr 2024",date:"2024-04-30",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"SGD",amount:1080,icEntityId:null},
  {id:"JE0677",entityId:"E002",period:"May 2024",date:"2024-05-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"SGD",amount:14400,icEntityId:null},
  {id:"JE0678",entityId:"E002",period:"May 2024",date:"2024-05-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"SGD",amount:9600,icEntityId:null},
  {id:"JE0679",entityId:"E002",period:"May 2024",date:"2024-05-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"SGD",amount:5040,icEntityId:null},
  {id:"JE0680",entityId:"E002",period:"May 2024",date:"2024-05-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"SGD",amount:3024,icEntityId:null},
  {id:"JE0681",entityId:"E002",period:"May 2024",date:"2024-05-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"SGD",amount:1512,icEntityId:null},
  {id:"JE0682",entityId:"E002",period:"May 2024",date:"2024-05-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"SGD",amount:504,icEntityId:null},
  {id:"JE0683",entityId:"E002",period:"May 2024",date:"2024-05-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"SGD",amount:2028,icEntityId:null},
  {id:"JE0684",entityId:"E002",period:"May 2024",date:"2024-05-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"SGD",amount:1092,icEntityId:null},
  {id:"JE0685",entityId:"E002",period:"May 2024",date:"2024-05-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"SGD",amount:1200,icEntityId:null},
  {id:"JE0686",entityId:"E002",period:"May 2024",date:"2024-05-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"SGD",amount:3024,icEntityId:null},
  {id:"JE0687",entityId:"E002",period:"May 2024",date:"2024-05-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"SGD",amount:1296,icEntityId:null},
  {id:"JE0688",entityId:"E002",period:"Jun 2024",date:"2024-06-30",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"SGD",amount:16800,icEntityId:null},
  {id:"JE0689",entityId:"E002",period:"Jun 2024",date:"2024-06-30",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"SGD",amount:11200,icEntityId:null},
  {id:"JE0690",entityId:"E002",period:"Jun 2024",date:"2024-06-30",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"SGD",amount:5880,icEntityId:null},
  {id:"JE0691",entityId:"E002",period:"Jun 2024",date:"2024-06-30",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"SGD",amount:3528,icEntityId:null},
  {id:"JE0692",entityId:"E002",period:"Jun 2024",date:"2024-06-30",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"SGD",amount:1764,icEntityId:null},
  {id:"JE0693",entityId:"E002",period:"Jun 2024",date:"2024-06-30",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"SGD",amount:588,icEntityId:null},
  {id:"JE0694",entityId:"E002",period:"Jun 2024",date:"2024-06-30",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"SGD",amount:2366,icEntityId:null},
  {id:"JE0695",entityId:"E002",period:"Jun 2024",date:"2024-06-30",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"SGD",amount:1274,icEntityId:null},
  {id:"JE0696",entityId:"E002",period:"Jun 2024",date:"2024-06-30",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"SGD",amount:1400,icEntityId:null},
  {id:"JE0697",entityId:"E002",period:"Jun 2024",date:"2024-06-30",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"SGD",amount:3528,icEntityId:null},
  {id:"JE0698",entityId:"E002",period:"Jun 2024",date:"2024-06-30",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"SGD",amount:1512,icEntityId:null},
  {id:"JE0699",entityId:"E002",period:"Jul 2024",date:"2024-07-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"SGD",amount:13200,icEntityId:null},
  {id:"JE0700",entityId:"E002",period:"Jul 2024",date:"2024-07-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"SGD",amount:8800,icEntityId:null},
  {id:"JE0701",entityId:"E002",period:"Jul 2024",date:"2024-07-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"SGD",amount:4620,icEntityId:null},
  {id:"JE0702",entityId:"E002",period:"Jul 2024",date:"2024-07-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"SGD",amount:2772,icEntityId:null},
  {id:"JE0703",entityId:"E002",period:"Jul 2024",date:"2024-07-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"SGD",amount:1386,icEntityId:null},
  {id:"JE0704",entityId:"E002",period:"Jul 2024",date:"2024-07-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"SGD",amount:462,icEntityId:null},
  {id:"JE0705",entityId:"E002",period:"Jul 2024",date:"2024-07-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"SGD",amount:1859,icEntityId:null},
  {id:"JE0706",entityId:"E002",period:"Jul 2024",date:"2024-07-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"SGD",amount:1001,icEntityId:null},
  {id:"JE0707",entityId:"E002",period:"Jul 2024",date:"2024-07-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"SGD",amount:1100,icEntityId:null},
  {id:"JE0708",entityId:"E002",period:"Jul 2024",date:"2024-07-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"SGD",amount:2772,icEntityId:null},
  {id:"JE0709",entityId:"E002",period:"Jul 2024",date:"2024-07-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"SGD",amount:1188,icEntityId:null},
  {id:"JE0710",entityId:"E002",period:"Aug 2024",date:"2024-08-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"SGD",amount:15600,icEntityId:null},
  {id:"JE0711",entityId:"E002",period:"Aug 2024",date:"2024-08-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"SGD",amount:10400,icEntityId:null},
  {id:"JE0712",entityId:"E002",period:"Aug 2024",date:"2024-08-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"SGD",amount:5460,icEntityId:null},
  {id:"JE0713",entityId:"E002",period:"Aug 2024",date:"2024-08-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"SGD",amount:3276,icEntityId:null},
  {id:"JE0714",entityId:"E002",period:"Aug 2024",date:"2024-08-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"SGD",amount:1638,icEntityId:null},
  {id:"JE0715",entityId:"E002",period:"Aug 2024",date:"2024-08-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"SGD",amount:546,icEntityId:null},
  {id:"JE0716",entityId:"E002",period:"Aug 2024",date:"2024-08-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"SGD",amount:2197,icEntityId:null},
  {id:"JE0717",entityId:"E002",period:"Aug 2024",date:"2024-08-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"SGD",amount:1183,icEntityId:null},
  {id:"JE0718",entityId:"E002",period:"Aug 2024",date:"2024-08-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"SGD",amount:1300,icEntityId:null},
  {id:"JE0719",entityId:"E002",period:"Aug 2024",date:"2024-08-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"SGD",amount:3276,icEntityId:null},
  {id:"JE0720",entityId:"E002",period:"Aug 2024",date:"2024-08-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"SGD",amount:1404,icEntityId:null},
  {id:"JE0721",entityId:"E002",period:"Sep 2024",date:"2024-09-30",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"SGD",amount:18000,icEntityId:null},
  {id:"JE0722",entityId:"E002",period:"Sep 2024",date:"2024-09-30",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"SGD",amount:12000,icEntityId:null},
  {id:"JE0723",entityId:"E002",period:"Sep 2024",date:"2024-09-30",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"SGD",amount:6300,icEntityId:null},
  {id:"JE0724",entityId:"E002",period:"Sep 2024",date:"2024-09-30",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"SGD",amount:3780,icEntityId:null},
  {id:"JE0725",entityId:"E002",period:"Sep 2024",date:"2024-09-30",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"SGD",amount:1890,icEntityId:null},
  {id:"JE0726",entityId:"E002",period:"Sep 2024",date:"2024-09-30",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"SGD",amount:630,icEntityId:null},
  {id:"JE0727",entityId:"E002",period:"Sep 2024",date:"2024-09-30",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"SGD",amount:2535,icEntityId:null},
  {id:"JE0728",entityId:"E002",period:"Sep 2024",date:"2024-09-30",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"SGD",amount:1365,icEntityId:null},
  {id:"JE0729",entityId:"E002",period:"Sep 2024",date:"2024-09-30",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"SGD",amount:1500,icEntityId:null},
  {id:"JE0730",entityId:"E002",period:"Sep 2024",date:"2024-09-30",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"SGD",amount:3780,icEntityId:null},
  {id:"JE0731",entityId:"E002",period:"Sep 2024",date:"2024-09-30",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"SGD",amount:1620,icEntityId:null},
  {id:"JE0732",entityId:"E002",period:"Oct 2024",date:"2024-10-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"SGD",amount:16800,icEntityId:null},
  {id:"JE0733",entityId:"E002",period:"Oct 2024",date:"2024-10-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"SGD",amount:11200,icEntityId:null},
  {id:"JE0734",entityId:"E002",period:"Oct 2024",date:"2024-10-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"SGD",amount:5880,icEntityId:null},
  {id:"JE0735",entityId:"E002",period:"Oct 2024",date:"2024-10-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"SGD",amount:3528,icEntityId:null},
  {id:"JE0736",entityId:"E002",period:"Oct 2024",date:"2024-10-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"SGD",amount:1764,icEntityId:null},
  {id:"JE0737",entityId:"E002",period:"Oct 2024",date:"2024-10-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"SGD",amount:588,icEntityId:null},
  {id:"JE0738",entityId:"E002",period:"Oct 2024",date:"2024-10-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"SGD",amount:2366,icEntityId:null},
  {id:"JE0739",entityId:"E002",period:"Oct 2024",date:"2024-10-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"SGD",amount:1274,icEntityId:null},
  {id:"JE0740",entityId:"E002",period:"Oct 2024",date:"2024-10-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"SGD",amount:1400,icEntityId:null},
  {id:"JE0741",entityId:"E002",period:"Oct 2024",date:"2024-10-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"SGD",amount:3528,icEntityId:null},
  {id:"JE0742",entityId:"E002",period:"Oct 2024",date:"2024-10-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"SGD",amount:1512,icEntityId:null},
  {id:"JE0743",entityId:"E002",period:"Nov 2024",date:"2024-11-30",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"SGD",amount:12600,icEntityId:null},
  {id:"JE0744",entityId:"E002",period:"Nov 2024",date:"2024-11-30",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"SGD",amount:8400,icEntityId:null},
  {id:"JE0745",entityId:"E002",period:"Nov 2024",date:"2024-11-30",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"SGD",amount:4410,icEntityId:null},
  {id:"JE0746",entityId:"E002",period:"Nov 2024",date:"2024-11-30",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"SGD",amount:2646,icEntityId:null},
  {id:"JE0747",entityId:"E002",period:"Nov 2024",date:"2024-11-30",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"SGD",amount:1323,icEntityId:null},
  {id:"JE0748",entityId:"E002",period:"Nov 2024",date:"2024-11-30",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"SGD",amount:441,icEntityId:null},
  {id:"JE0749",entityId:"E002",period:"Nov 2024",date:"2024-11-30",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"SGD",amount:1774,icEntityId:null},
  {id:"JE0750",entityId:"E002",period:"Nov 2024",date:"2024-11-30",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"SGD",amount:956,icEntityId:null},
  {id:"JE0751",entityId:"E002",period:"Nov 2024",date:"2024-11-30",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"SGD",amount:1050,icEntityId:null},
  {id:"JE0752",entityId:"E002",period:"Nov 2024",date:"2024-11-30",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"SGD",amount:2646,icEntityId:null},
  {id:"JE0753",entityId:"E002",period:"Nov 2024",date:"2024-11-30",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"SGD",amount:1134,icEntityId:null},
  {id:"JE0754",entityId:"E002",period:"Dec 2024",date:"2024-12-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"SGD",amount:16800,icEntityId:null},
  {id:"JE0755",entityId:"E002",period:"Dec 2024",date:"2024-12-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"SGD",amount:11200,icEntityId:null},
  {id:"JE0756",entityId:"E002",period:"Dec 2024",date:"2024-12-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"SGD",amount:5880,icEntityId:null},
  {id:"JE0757",entityId:"E002",period:"Dec 2024",date:"2024-12-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"SGD",amount:3528,icEntityId:null},
  {id:"JE0758",entityId:"E002",period:"Dec 2024",date:"2024-12-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"SGD",amount:1764,icEntityId:null},
  {id:"JE0759",entityId:"E002",period:"Dec 2024",date:"2024-12-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"SGD",amount:588,icEntityId:null},
  {id:"JE0760",entityId:"E002",period:"Dec 2024",date:"2024-12-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"SGD",amount:2366,icEntityId:null},
  {id:"JE0761",entityId:"E002",period:"Dec 2024",date:"2024-12-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"SGD",amount:1274,icEntityId:null},
  {id:"JE0762",entityId:"E002",period:"Dec 2024",date:"2024-12-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"SGD",amount:1400,icEntityId:null},
  {id:"JE0763",entityId:"E002",period:"Dec 2024",date:"2024-12-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"SGD",amount:3528,icEntityId:null},
  {id:"JE0764",entityId:"E002",period:"Dec 2024",date:"2024-12-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"SGD",amount:1512,icEntityId:null},
  {id:"JE0765",entityId:"E003",period:"Jan 2024",date:"2024-01-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"PHP",amount:348000,icEntityId:null},
  {id:"JE0766",entityId:"E003",period:"Jan 2024",date:"2024-01-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"PHP",amount:232000,icEntityId:null},
  {id:"JE0767",entityId:"E003",period:"Jan 2024",date:"2024-01-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"PHP",amount:121800,icEntityId:null},
  {id:"JE0768",entityId:"E003",period:"Jan 2024",date:"2024-01-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"PHP",amount:73080,icEntityId:null},
  {id:"JE0769",entityId:"E003",period:"Jan 2024",date:"2024-01-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"PHP",amount:36540,icEntityId:null},
  {id:"JE0770",entityId:"E003",period:"Jan 2024",date:"2024-01-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"PHP",amount:12180,icEntityId:null},
  {id:"JE0771",entityId:"E003",period:"Jan 2024",date:"2024-01-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"PHP",amount:49010,icEntityId:null},
  {id:"JE0772",entityId:"E003",period:"Jan 2024",date:"2024-01-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"PHP",amount:26390,icEntityId:null},
  {id:"JE0773",entityId:"E003",period:"Jan 2024",date:"2024-01-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"PHP",amount:29000,icEntityId:null},
  {id:"JE0774",entityId:"E003",period:"Jan 2024",date:"2024-01-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"PHP",amount:73080,icEntityId:null},
  {id:"JE0775",entityId:"E003",period:"Jan 2024",date:"2024-01-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"PHP",amount:31320,icEntityId:null},
  {id:"JE0776",entityId:"E003",period:"Feb 2024",date:"2024-02-29",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"PHP",amount:372000,icEntityId:null},
  {id:"JE0777",entityId:"E003",period:"Feb 2024",date:"2024-02-29",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"PHP",amount:248000,icEntityId:null},
  {id:"JE0778",entityId:"E003",period:"Feb 2024",date:"2024-02-29",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"PHP",amount:130200,icEntityId:null},
  {id:"JE0779",entityId:"E003",period:"Feb 2024",date:"2024-02-29",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"PHP",amount:78120,icEntityId:null},
  {id:"JE0780",entityId:"E003",period:"Feb 2024",date:"2024-02-29",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"PHP",amount:39060,icEntityId:null},
  {id:"JE0781",entityId:"E003",period:"Feb 2024",date:"2024-02-29",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"PHP",amount:13020,icEntityId:null},
  {id:"JE0782",entityId:"E003",period:"Feb 2024",date:"2024-02-29",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"PHP",amount:52390,icEntityId:null},
  {id:"JE0783",entityId:"E003",period:"Feb 2024",date:"2024-02-29",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"PHP",amount:28210,icEntityId:null},
  {id:"JE0784",entityId:"E003",period:"Feb 2024",date:"2024-02-29",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"PHP",amount:31000,icEntityId:null},
  {id:"JE0785",entityId:"E003",period:"Feb 2024",date:"2024-02-29",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"PHP",amount:78120,icEntityId:null},
  {id:"JE0786",entityId:"E003",period:"Feb 2024",date:"2024-02-29",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"PHP",amount:33480,icEntityId:null},
  {id:"JE0787",entityId:"E003",period:"Mar 2024",date:"2024-03-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"PHP",amount:426000,icEntityId:null},
  {id:"JE0788",entityId:"E003",period:"Mar 2024",date:"2024-03-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"PHP",amount:284000,icEntityId:null},
  {id:"JE0789",entityId:"E003",period:"Mar 2024",date:"2024-03-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"PHP",amount:149100,icEntityId:null},
  {id:"JE0790",entityId:"E003",period:"Mar 2024",date:"2024-03-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"PHP",amount:89460,icEntityId:null},
  {id:"JE0791",entityId:"E003",period:"Mar 2024",date:"2024-03-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"PHP",amount:44730,icEntityId:null},
  {id:"JE0792",entityId:"E003",period:"Mar 2024",date:"2024-03-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"PHP",amount:14910,icEntityId:null},
  {id:"JE0793",entityId:"E003",period:"Mar 2024",date:"2024-03-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"PHP",amount:59995,icEntityId:null},
  {id:"JE0794",entityId:"E003",period:"Mar 2024",date:"2024-03-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"PHP",amount:32305,icEntityId:null},
  {id:"JE0795",entityId:"E003",period:"Mar 2024",date:"2024-03-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"PHP",amount:35500,icEntityId:null},
  {id:"JE0796",entityId:"E003",period:"Mar 2024",date:"2024-03-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"PHP",amount:89460,icEntityId:null},
  {id:"JE0797",entityId:"E003",period:"Mar 2024",date:"2024-03-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"PHP",amount:38340,icEntityId:null},
  {id:"JE0798",entityId:"E003",period:"Apr 2024",date:"2024-04-30",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"PHP",amount:408000,icEntityId:null},
  {id:"JE0799",entityId:"E003",period:"Apr 2024",date:"2024-04-30",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"PHP",amount:272000,icEntityId:null},
  {id:"JE0800",entityId:"E003",period:"Apr 2024",date:"2024-04-30",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"PHP",amount:142800,icEntityId:null},
  {id:"JE0801",entityId:"E003",period:"Apr 2024",date:"2024-04-30",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"PHP",amount:85680,icEntityId:null},
  {id:"JE0802",entityId:"E003",period:"Apr 2024",date:"2024-04-30",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"PHP",amount:42840,icEntityId:null},
  {id:"JE0803",entityId:"E003",period:"Apr 2024",date:"2024-04-30",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"PHP",amount:14280,icEntityId:null},
  {id:"JE0804",entityId:"E003",period:"Apr 2024",date:"2024-04-30",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"PHP",amount:57460,icEntityId:null},
  {id:"JE0805",entityId:"E003",period:"Apr 2024",date:"2024-04-30",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"PHP",amount:30940,icEntityId:null},
  {id:"JE0806",entityId:"E003",period:"Apr 2024",date:"2024-04-30",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"PHP",amount:34000,icEntityId:null},
  {id:"JE0807",entityId:"E003",period:"Apr 2024",date:"2024-04-30",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"PHP",amount:85680,icEntityId:null},
  {id:"JE0808",entityId:"E003",period:"Apr 2024",date:"2024-04-30",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"PHP",amount:36720,icEntityId:null},
  {id:"JE0809",entityId:"E003",period:"May 2024",date:"2024-05-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"PHP",amount:450000,icEntityId:null},
  {id:"JE0810",entityId:"E003",period:"May 2024",date:"2024-05-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"PHP",amount:300000,icEntityId:null},
  {id:"JE0811",entityId:"E003",period:"May 2024",date:"2024-05-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"PHP",amount:157500,icEntityId:null},
  {id:"JE0812",entityId:"E003",period:"May 2024",date:"2024-05-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"PHP",amount:94500,icEntityId:null},
  {id:"JE0813",entityId:"E003",period:"May 2024",date:"2024-05-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"PHP",amount:47250,icEntityId:null},
  {id:"JE0814",entityId:"E003",period:"May 2024",date:"2024-05-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"PHP",amount:15750,icEntityId:null},
  {id:"JE0815",entityId:"E003",period:"May 2024",date:"2024-05-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"PHP",amount:63375,icEntityId:null},
  {id:"JE0816",entityId:"E003",period:"May 2024",date:"2024-05-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"PHP",amount:34125,icEntityId:null},
  {id:"JE0817",entityId:"E003",period:"May 2024",date:"2024-05-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"PHP",amount:37500,icEntityId:null},
  {id:"JE0818",entityId:"E003",period:"May 2024",date:"2024-05-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"PHP",amount:94500,icEntityId:null},
  {id:"JE0819",entityId:"E003",period:"May 2024",date:"2024-05-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"PHP",amount:40500,icEntityId:null},
  {id:"JE0820",entityId:"E003",period:"Jun 2024",date:"2024-06-30",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"PHP",amount:492000,icEntityId:null},
  {id:"JE0821",entityId:"E003",period:"Jun 2024",date:"2024-06-30",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"PHP",amount:328000,icEntityId:null},
  {id:"JE0822",entityId:"E003",period:"Jun 2024",date:"2024-06-30",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"PHP",amount:172200,icEntityId:null},
  {id:"JE0823",entityId:"E003",period:"Jun 2024",date:"2024-06-30",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"PHP",amount:103320,icEntityId:null},
  {id:"JE0824",entityId:"E003",period:"Jun 2024",date:"2024-06-30",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"PHP",amount:51660,icEntityId:null},
  {id:"JE0825",entityId:"E003",period:"Jun 2024",date:"2024-06-30",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"PHP",amount:17220,icEntityId:null},
  {id:"JE0826",entityId:"E003",period:"Jun 2024",date:"2024-06-30",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"PHP",amount:69290,icEntityId:null},
  {id:"JE0827",entityId:"E003",period:"Jun 2024",date:"2024-06-30",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"PHP",amount:37310,icEntityId:null},
  {id:"JE0828",entityId:"E003",period:"Jun 2024",date:"2024-06-30",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"PHP",amount:41000,icEntityId:null},
  {id:"JE0829",entityId:"E003",period:"Jun 2024",date:"2024-06-30",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"PHP",amount:103320,icEntityId:null},
  {id:"JE0830",entityId:"E003",period:"Jun 2024",date:"2024-06-30",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"PHP",amount:44280,icEntityId:null},
  {id:"JE0831",entityId:"E003",period:"Jul 2024",date:"2024-07-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"PHP",amount:456000,icEntityId:null},
  {id:"JE0832",entityId:"E003",period:"Jul 2024",date:"2024-07-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"PHP",amount:304000,icEntityId:null},
  {id:"JE0833",entityId:"E003",period:"Jul 2024",date:"2024-07-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"PHP",amount:159600,icEntityId:null},
  {id:"JE0834",entityId:"E003",period:"Jul 2024",date:"2024-07-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"PHP",amount:95760,icEntityId:null},
  {id:"JE0835",entityId:"E003",period:"Jul 2024",date:"2024-07-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"PHP",amount:47880,icEntityId:null},
  {id:"JE0836",entityId:"E003",period:"Jul 2024",date:"2024-07-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"PHP",amount:15960,icEntityId:null},
  {id:"JE0837",entityId:"E003",period:"Jul 2024",date:"2024-07-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"PHP",amount:64220,icEntityId:null},
  {id:"JE0838",entityId:"E003",period:"Jul 2024",date:"2024-07-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"PHP",amount:34580,icEntityId:null},
  {id:"JE0839",entityId:"E003",period:"Jul 2024",date:"2024-07-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"PHP",amount:38000,icEntityId:null},
  {id:"JE0840",entityId:"E003",period:"Jul 2024",date:"2024-07-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"PHP",amount:95760,icEntityId:null},
  {id:"JE0841",entityId:"E003",period:"Jul 2024",date:"2024-07-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"PHP",amount:41040,icEntityId:null},
  {id:"JE0842",entityId:"E003",period:"Aug 2024",date:"2024-08-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"PHP",amount:480000,icEntityId:null},
  {id:"JE0843",entityId:"E003",period:"Aug 2024",date:"2024-08-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"PHP",amount:320000,icEntityId:null},
  {id:"JE0844",entityId:"E003",period:"Aug 2024",date:"2024-08-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"PHP",amount:168000,icEntityId:null},
  {id:"JE0845",entityId:"E003",period:"Aug 2024",date:"2024-08-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"PHP",amount:100800,icEntityId:null},
  {id:"JE0846",entityId:"E003",period:"Aug 2024",date:"2024-08-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"PHP",amount:50400,icEntityId:null},
  {id:"JE0847",entityId:"E003",period:"Aug 2024",date:"2024-08-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"PHP",amount:16800,icEntityId:null},
  {id:"JE0848",entityId:"E003",period:"Aug 2024",date:"2024-08-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"PHP",amount:67600,icEntityId:null},
  {id:"JE0849",entityId:"E003",period:"Aug 2024",date:"2024-08-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"PHP",amount:36400,icEntityId:null},
  {id:"JE0850",entityId:"E003",period:"Aug 2024",date:"2024-08-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"PHP",amount:40000,icEntityId:null},
  {id:"JE0851",entityId:"E003",period:"Aug 2024",date:"2024-08-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"PHP",amount:100800,icEntityId:null},
  {id:"JE0852",entityId:"E003",period:"Aug 2024",date:"2024-08-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"PHP",amount:43200,icEntityId:null},
  {id:"JE0853",entityId:"E003",period:"Sep 2024",date:"2024-09-30",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"PHP",amount:522000,icEntityId:null},
  {id:"JE0854",entityId:"E003",period:"Sep 2024",date:"2024-09-30",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"PHP",amount:348000,icEntityId:null},
  {id:"JE0855",entityId:"E003",period:"Sep 2024",date:"2024-09-30",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"PHP",amount:182700,icEntityId:null},
  {id:"JE0856",entityId:"E003",period:"Sep 2024",date:"2024-09-30",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"PHP",amount:109620,icEntityId:null},
  {id:"JE0857",entityId:"E003",period:"Sep 2024",date:"2024-09-30",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"PHP",amount:54810,icEntityId:null},
  {id:"JE0858",entityId:"E003",period:"Sep 2024",date:"2024-09-30",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"PHP",amount:18270,icEntityId:null},
  {id:"JE0859",entityId:"E003",period:"Sep 2024",date:"2024-09-30",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"PHP",amount:73515,icEntityId:null},
  {id:"JE0860",entityId:"E003",period:"Sep 2024",date:"2024-09-30",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"PHP",amount:39585,icEntityId:null},
  {id:"JE0861",entityId:"E003",period:"Sep 2024",date:"2024-09-30",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"PHP",amount:43500,icEntityId:null},
  {id:"JE0862",entityId:"E003",period:"Sep 2024",date:"2024-09-30",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"PHP",amount:109620,icEntityId:null},
  {id:"JE0863",entityId:"E003",period:"Sep 2024",date:"2024-09-30",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"PHP",amount:46980,icEntityId:null},
  {id:"JE0864",entityId:"E003",period:"Oct 2024",date:"2024-10-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"PHP",amount:504000,icEntityId:null},
  {id:"JE0865",entityId:"E003",period:"Oct 2024",date:"2024-10-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"PHP",amount:336000,icEntityId:null},
  {id:"JE0866",entityId:"E003",period:"Oct 2024",date:"2024-10-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"PHP",amount:176400,icEntityId:null},
  {id:"JE0867",entityId:"E003",period:"Oct 2024",date:"2024-10-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"PHP",amount:105840,icEntityId:null},
  {id:"JE0868",entityId:"E003",period:"Oct 2024",date:"2024-10-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"PHP",amount:52920,icEntityId:null},
  {id:"JE0869",entityId:"E003",period:"Oct 2024",date:"2024-10-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"PHP",amount:17640,icEntityId:null},
  {id:"JE0870",entityId:"E003",period:"Oct 2024",date:"2024-10-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"PHP",amount:70980,icEntityId:null},
  {id:"JE0871",entityId:"E003",period:"Oct 2024",date:"2024-10-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"PHP",amount:38220,icEntityId:null},
  {id:"JE0872",entityId:"E003",period:"Oct 2024",date:"2024-10-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"PHP",amount:42000,icEntityId:null},
  {id:"JE0873",entityId:"E003",period:"Oct 2024",date:"2024-10-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"PHP",amount:105840,icEntityId:null},
  {id:"JE0874",entityId:"E003",period:"Oct 2024",date:"2024-10-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"PHP",amount:45360,icEntityId:null},
  {id:"JE0875",entityId:"E003",period:"Nov 2024",date:"2024-11-30",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"PHP",amount:432000,icEntityId:null},
  {id:"JE0876",entityId:"E003",period:"Nov 2024",date:"2024-11-30",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"PHP",amount:288000,icEntityId:null},
  {id:"JE0877",entityId:"E003",period:"Nov 2024",date:"2024-11-30",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"PHP",amount:151200,icEntityId:null},
  {id:"JE0878",entityId:"E003",period:"Nov 2024",date:"2024-11-30",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"PHP",amount:90720,icEntityId:null},
  {id:"JE0879",entityId:"E003",period:"Nov 2024",date:"2024-11-30",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"PHP",amount:45360,icEntityId:null},
  {id:"JE0880",entityId:"E003",period:"Nov 2024",date:"2024-11-30",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"PHP",amount:15120,icEntityId:null},
  {id:"JE0881",entityId:"E003",period:"Nov 2024",date:"2024-11-30",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"PHP",amount:60840,icEntityId:null},
  {id:"JE0882",entityId:"E003",period:"Nov 2024",date:"2024-11-30",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"PHP",amount:32760,icEntityId:null},
  {id:"JE0883",entityId:"E003",period:"Nov 2024",date:"2024-11-30",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"PHP",amount:36000,icEntityId:null},
  {id:"JE0884",entityId:"E003",period:"Nov 2024",date:"2024-11-30",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"PHP",amount:90720,icEntityId:null},
  {id:"JE0885",entityId:"E003",period:"Nov 2024",date:"2024-11-30",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"PHP",amount:38880,icEntityId:null},
  {id:"JE0886",entityId:"E003",period:"Dec 2024",date:"2024-12-31",ref:"DOM",description:"Sales Revenue - Domestic",drAccount:"1100",crAccount:"4001",currency:"PHP",amount:510000,icEntityId:null},
  {id:"JE0887",entityId:"E003",period:"Dec 2024",date:"2024-12-31",ref:"EXP",description:"Sales Revenue - Export",drAccount:"1100",crAccount:"4002",currency:"PHP",amount:340000,icEntityId:null},
  {id:"JE0888",entityId:"E003",period:"Dec 2024",date:"2024-12-31",ref:"SDR",description:"Staff Cost - Direct",drAccount:"5101",crAccount:"2000",currency:"PHP",amount:178500,icEntityId:null},
  {id:"JE0889",entityId:"E003",period:"Dec 2024",date:"2024-12-31",ref:"SID",description:"Staff Cost - Indirect",drAccount:"5102",crAccount:"2000",currency:"PHP",amount:107100,icEntityId:null},
  {id:"JE0890",entityId:"E003",period:"Dec 2024",date:"2024-12-31",ref:"MKT",description:"Marketing & Selling",drAccount:"5103",crAccount:"2000",currency:"PHP",amount:53550,icEntityId:null},
  {id:"JE0891",entityId:"E003",period:"Dec 2024",date:"2024-12-31",ref:"TRV",description:"Travelling Expenses",drAccount:"5104",crAccount:"2000",currency:"PHP",amount:17850,icEntityId:null},
  {id:"JE0892",entityId:"E003",period:"Dec 2024",date:"2024-12-31",ref:"GAD",description:"General & Admin",drAccount:"5401",crAccount:"2000",currency:"PHP",amount:71825,icEntityId:null},
  {id:"JE0893",entityId:"E003",period:"Dec 2024",date:"2024-12-31",ref:"FIN",description:"Financing Expenses",drAccount:"5501",crAccount:"2000",currency:"PHP",amount:38675,icEntityId:null},
  {id:"JE0894",entityId:"E003",period:"Dec 2024",date:"2024-12-31",ref:"DEP",description:"Depreciation Expense",drAccount:"5301",crAccount:"1500",currency:"PHP",amount:42500,icEntityId:null},
  {id:"JE0895",entityId:"E003",period:"Dec 2024",date:"2024-12-31",ref:"MAT",description:"Direct Materials",drAccount:"5001",crAccount:"2000",currency:"PHP",amount:107100,icEntityId:null},
  {id:"JE0896",entityId:"E003",period:"Dec 2024",date:"2024-12-31",ref:"LAB",description:"Direct Labour",drAccount:"5002",crAccount:"2000",currency:"PHP",amount:45900,icEntityId:null}
];

const MOCK_AR = [
  {id:"AR-001",entityId:"E001",counterparty:"Celestica Sdn Bhd",invoiceDate:"2024-09-15",dueDate:"2024-10-15",currency:"MYR",amount:84287,status:"Paid",notes:"Professional services"},
  {id:"AR-002",entityId:"E001",counterparty:"OCK Group Berhad",invoiceDate:"2024-09-15",dueDate:"2024-10-15",currency:"MYR",amount:74210,status:"Paid",notes:"Professional services"},
  {id:"AR-003",entityId:"E001",counterparty:"Petronas Nasional",invoiceDate:"2024-09-15",dueDate:"2024-10-15",currency:"MYR",amount:78310,status:"Paid",notes:"Professional services"},
  {id:"AR-004",entityId:"E001",counterparty:"RHB Banking Group",invoiceDate:"2024-09-15",dueDate:"2024-10-15",currency:"MYR",amount:77461,status:"Paid",notes:"Professional services"},
  {id:"AR-005",entityId:"E002",counterparty:"Axiata Group SG",invoiceDate:"2024-09-15",dueDate:"2024-10-15",currency:"USD",amount:14662,status:"Paid",notes:"Professional services"},
  {id:"AR-006",entityId:"E002",counterparty:"DBS Bank Singapore",invoiceDate:"2024-09-15",dueDate:"2024-10-15",currency:"SGD",amount:9525,status:"Paid",notes:"Professional services"},
  {id:"AR-007",entityId:"E003",counterparty:"Jollibee Foods Corp",invoiceDate:"2024-09-15",dueDate:"2024-10-15",currency:"PHP",amount:992161,status:"Paid",notes:"Professional services"},
  {id:"AR-008",entityId:"E003",counterparty:"SM Prime Holdings",invoiceDate:"2024-09-15",dueDate:"2024-10-15",currency:"PHP",amount:843997,status:"Paid",notes:"Professional services"},
  {id:"AR-009",entityId:"E001",counterparty:"Celestica Sdn Bhd",invoiceDate:"2024-10-01",dueDate:"2024-10-31",currency:"MYR",amount:93517,status:"Paid",notes:"Professional services"},
  {id:"AR-010",entityId:"E001",counterparty:"OCK Group Berhad",invoiceDate:"2024-10-01",dueDate:"2024-10-31",currency:"MYR",amount:86066,status:"Paid",notes:"Professional services"},
  {id:"AR-011",entityId:"E001",counterparty:"Petronas Nasional",invoiceDate:"2024-10-01",dueDate:"2024-10-31",currency:"MYR",amount:89654,status:"Paid",notes:"Professional services"},
  {id:"AR-012",entityId:"E001",counterparty:"RHB Banking Group",invoiceDate:"2024-10-01",dueDate:"2024-10-31",currency:"MYR",amount:95102,status:"Paid",notes:"Professional services"},
  {id:"AR-013",entityId:"E002",counterparty:"Axiata Group SG",invoiceDate:"2024-10-01",dueDate:"2024-10-31",currency:"USD",amount:10864,status:"Paid",notes:"Professional services"},
  {id:"AR-014",entityId:"E002",counterparty:"DBS Bank Singapore",invoiceDate:"2024-10-01",dueDate:"2024-10-31",currency:"SGD",amount:9868,status:"Paid",notes:"Professional services"},
  {id:"AR-015",entityId:"E003",counterparty:"Jollibee Foods Corp",invoiceDate:"2024-10-01",dueDate:"2024-10-31",currency:"PHP",amount:875480,status:"Paid",notes:"Professional services"},
  {id:"AR-016",entityId:"E003",counterparty:"SM Prime Holdings",invoiceDate:"2024-10-01",dueDate:"2024-10-31",currency:"PHP",amount:857640,status:"Paid",notes:"Professional services"},
  {id:"AR-017",entityId:"E001",counterparty:"Celestica Sdn Bhd",invoiceDate:"2024-10-15",dueDate:"2024-11-14",currency:"MYR",amount:67974,status:"Overdue",notes:"Professional services"},
  {id:"AR-018",entityId:"E001",counterparty:"OCK Group Berhad",invoiceDate:"2024-10-15",dueDate:"2024-11-14",currency:"MYR",amount:73285,status:"Overdue",notes:"Professional services"},
  {id:"AR-019",entityId:"E001",counterparty:"Petronas Nasional",invoiceDate:"2024-10-15",dueDate:"2024-11-14",currency:"MYR",amount:76456,status:"Overdue",notes:"Professional services"},
  {id:"AR-020",entityId:"E001",counterparty:"RHB Banking Group",invoiceDate:"2024-10-15",dueDate:"2024-11-14",currency:"MYR",amount:64894,status:"Overdue",notes:"Professional services"},
  {id:"AR-021",entityId:"E002",counterparty:"Axiata Group SG",invoiceDate:"2024-10-15",dueDate:"2024-11-14",currency:"USD",amount:15917,status:"Overdue",notes:"Professional services"},
  {id:"AR-022",entityId:"E002",counterparty:"DBS Bank Singapore",invoiceDate:"2024-10-15",dueDate:"2024-11-14",currency:"SGD",amount:9149,status:"Overdue",notes:"Professional services"},
  {id:"AR-023",entityId:"E003",counterparty:"Jollibee Foods Corp",invoiceDate:"2024-10-15",dueDate:"2024-11-14",currency:"PHP",amount:755079,status:"Overdue",notes:"Professional services"},
  {id:"AR-024",entityId:"E003",counterparty:"SM Prime Holdings",invoiceDate:"2024-10-15",dueDate:"2024-11-14",currency:"PHP",amount:726255,status:"Overdue",notes:"Professional services"},
  {id:"AR-025",entityId:"E001",counterparty:"Celestica Sdn Bhd",invoiceDate:"2024-11-01",dueDate:"2024-12-01",currency:"MYR",amount:52935,status:"Overdue",notes:"Professional services"},
  {id:"AR-026",entityId:"E001",counterparty:"OCK Group Berhad",invoiceDate:"2024-11-01",dueDate:"2024-12-01",currency:"MYR",amount:46915,status:"Overdue",notes:"Professional services"},
  {id:"AR-027",entityId:"E001",counterparty:"Petronas Nasional",invoiceDate:"2024-11-01",dueDate:"2024-12-01",currency:"MYR",amount:44550,status:"Overdue",notes:"Professional services"},
  {id:"AR-028",entityId:"E001",counterparty:"RHB Banking Group",invoiceDate:"2024-11-01",dueDate:"2024-12-01",currency:"MYR",amount:44588,status:"Overdue",notes:"Professional services"},
  {id:"AR-029",entityId:"E002",counterparty:"Axiata Group SG",invoiceDate:"2024-11-01",dueDate:"2024-12-01",currency:"USD",amount:11764,status:"Overdue",notes:"Professional services"},
  {id:"AR-030",entityId:"E002",counterparty:"DBS Bank Singapore",invoiceDate:"2024-11-01",dueDate:"2024-12-01",currency:"SGD",amount:11228,status:"Overdue",notes:"Professional services"},
  {id:"AR-031",entityId:"E003",counterparty:"Jollibee Foods Corp",invoiceDate:"2024-11-01",dueDate:"2024-12-01",currency:"PHP",amount:1018969,status:"Overdue",notes:"Professional services"},
  {id:"AR-032",entityId:"E003",counterparty:"SM Prime Holdings",invoiceDate:"2024-11-01",dueDate:"2024-12-01",currency:"PHP",amount:1004109,status:"Overdue",notes:"Professional services"},
  {id:"AR-033",entityId:"E001",counterparty:"Celestica Sdn Bhd",invoiceDate:"2024-11-15",dueDate:"2024-12-15",currency:"MYR",amount:65471,status:"Outstanding",notes:"Professional services"},
  {id:"AR-034",entityId:"E001",counterparty:"OCK Group Berhad",invoiceDate:"2024-11-15",dueDate:"2024-12-15",currency:"MYR",amount:71151,status:"Outstanding",notes:"Professional services"},
  {id:"AR-035",entityId:"E001",counterparty:"Petronas Nasional",invoiceDate:"2024-11-15",dueDate:"2024-12-15",currency:"MYR",amount:63421,status:"Outstanding",notes:"Professional services"},
  {id:"AR-036",entityId:"E001",counterparty:"RHB Banking Group",invoiceDate:"2024-11-15",dueDate:"2024-12-15",currency:"MYR",amount:65677,status:"Outstanding",notes:"Professional services"},
  {id:"AR-037",entityId:"E002",counterparty:"Axiata Group SG",invoiceDate:"2024-11-15",dueDate:"2024-12-15",currency:"USD",amount:14922,status:"Outstanding",notes:"Professional services"},
  {id:"AR-038",entityId:"E002",counterparty:"DBS Bank Singapore",invoiceDate:"2024-11-15",dueDate:"2024-12-15",currency:"SGD",amount:9418,status:"Outstanding",notes:"Professional services"},
  {id:"AR-039",entityId:"E003",counterparty:"Jollibee Foods Corp",invoiceDate:"2024-11-15",dueDate:"2024-12-15",currency:"PHP",amount:986554,status:"Outstanding",notes:"Professional services"},
  {id:"AR-040",entityId:"E003",counterparty:"SM Prime Holdings",invoiceDate:"2024-11-15",dueDate:"2024-12-15",currency:"PHP",amount:934233,status:"Outstanding",notes:"Professional services"},
  {id:"AR-041",entityId:"E001",counterparty:"Celestica Sdn Bhd",invoiceDate:"2024-12-01",dueDate:"2025-01-01",currency:"MYR",amount:81191,status:"Outstanding",notes:"Professional services"},
  {id:"AR-042",entityId:"E001",counterparty:"OCK Group Berhad",invoiceDate:"2024-12-01",dueDate:"2025-01-01",currency:"MYR",amount:70915,status:"Outstanding",notes:"Professional services"},
  {id:"AR-043",entityId:"E001",counterparty:"Petronas Nasional",invoiceDate:"2024-12-01",dueDate:"2025-01-01",currency:"MYR",amount:73755,status:"Outstanding",notes:"Professional services"},
  {id:"AR-044",entityId:"E001",counterparty:"RHB Banking Group",invoiceDate:"2024-12-01",dueDate:"2025-01-01",currency:"MYR",amount:74714,status:"Outstanding",notes:"Professional services"},
  {id:"AR-045",entityId:"E002",counterparty:"Axiata Group SG",invoiceDate:"2024-12-01",dueDate:"2025-01-01",currency:"USD",amount:10992,status:"Outstanding",notes:"Professional services"},
  {id:"AR-046",entityId:"E002",counterparty:"DBS Bank Singapore",invoiceDate:"2024-12-01",dueDate:"2025-01-01",currency:"SGD",amount:9939,status:"Outstanding",notes:"Professional services"},
  {id:"AR-047",entityId:"E003",counterparty:"Jollibee Foods Corp",invoiceDate:"2024-12-01",dueDate:"2025-01-01",currency:"PHP",amount:782170,status:"Outstanding",notes:"Professional services"},
  {id:"AR-048",entityId:"E003",counterparty:"SM Prime Holdings",invoiceDate:"2024-12-01",dueDate:"2025-01-01",currency:"PHP",amount:812256,status:"Outstanding",notes:"Professional services"},
  {id:"AR-049",entityId:"E001",counterparty:"Celestica Sdn Bhd",invoiceDate:"2024-12-15",dueDate:"2025-01-14",currency:"MYR",amount:93469,status:"Outstanding",notes:"Professional services"},
  {id:"AR-050",entityId:"E001",counterparty:"OCK Group Berhad",invoiceDate:"2024-12-15",dueDate:"2025-01-14",currency:"MYR",amount:88540,status:"Outstanding",notes:"Professional services"},
  {id:"AR-051",entityId:"E001",counterparty:"Petronas Nasional",invoiceDate:"2024-12-15",dueDate:"2025-01-14",currency:"MYR",amount:88637,status:"Outstanding",notes:"Professional services"},
  {id:"AR-052",entityId:"E001",counterparty:"RHB Banking Group",invoiceDate:"2024-12-15",dueDate:"2025-01-14",currency:"MYR",amount:85713,status:"Outstanding",notes:"Professional services"},
  {id:"AR-053",entityId:"E002",counterparty:"Axiata Group SG",invoiceDate:"2024-12-15",dueDate:"2025-01-14",currency:"USD",amount:14301,status:"Outstanding",notes:"Professional services"},
  {id:"AR-054",entityId:"E002",counterparty:"DBS Bank Singapore",invoiceDate:"2024-12-15",dueDate:"2025-01-14",currency:"SGD",amount:9569,status:"Outstanding",notes:"Professional services"},
  {id:"AR-055",entityId:"E003",counterparty:"Jollibee Foods Corp",invoiceDate:"2024-12-15",dueDate:"2025-01-14",currency:"PHP",amount:803094,status:"Outstanding",notes:"Professional services"},
  {id:"AR-056",entityId:"E003",counterparty:"SM Prime Holdings",invoiceDate:"2024-12-15",dueDate:"2025-01-14",currency:"PHP",amount:797024,status:"Outstanding",notes:"Professional services"},
  {id:"AR-057",entityId:"E001",counterparty:"Celestica Sdn Bhd",invoiceDate:"2025-01-01",dueDate:"2025-01-31",currency:"MYR",amount:48580,status:"Outstanding",notes:"Professional services"},
  {id:"AR-058",entityId:"E001",counterparty:"OCK Group Berhad",invoiceDate:"2025-01-01",dueDate:"2025-01-31",currency:"MYR",amount:54383,status:"Outstanding",notes:"Professional services"},
  {id:"AR-059",entityId:"E001",counterparty:"Petronas Nasional",invoiceDate:"2025-01-01",dueDate:"2025-01-31",currency:"MYR",amount:48499,status:"Outstanding",notes:"Professional services"},
  {id:"AR-060",entityId:"E001",counterparty:"RHB Banking Group",invoiceDate:"2025-01-01",dueDate:"2025-01-31",currency:"MYR",amount:50746,status:"Outstanding",notes:"Professional services"},
  {id:"AR-061",entityId:"E002",counterparty:"Axiata Group SG",invoiceDate:"2025-01-01",dueDate:"2025-01-31",currency:"USD",amount:12077,status:"Outstanding",notes:"Professional services"},
  {id:"AR-062",entityId:"E002",counterparty:"DBS Bank Singapore",invoiceDate:"2025-01-01",dueDate:"2025-01-31",currency:"SGD",amount:11308,status:"Outstanding",notes:"Professional services"},
  {id:"AR-063",entityId:"E003",counterparty:"Jollibee Foods Corp",invoiceDate:"2025-01-01",dueDate:"2025-01-31",currency:"PHP",amount:970934,status:"Outstanding",notes:"Professional services"},
  {id:"AR-064",entityId:"E003",counterparty:"SM Prime Holdings",invoiceDate:"2025-01-01",dueDate:"2025-01-31",currency:"PHP",amount:995446,status:"Outstanding",notes:"Professional services"}
];

const MOCK_AP = [
  {id:"AP-001",entityId:"E001",counterparty:"OTG Singapore Pte",invoiceDate:"2024-10-01",dueDate:"2024-11-01",currency:"SGD",amount:22453,status:"Paid",notes:"Services"},
  {id:"AP-002",entityId:"E001",counterparty:"KL Office Supplies",invoiceDate:"2024-10-01",dueDate:"2024-11-01",currency:"MYR",amount:3558,status:"Paid",notes:"Services"},
  {id:"AP-003",entityId:"E001",counterparty:"Telekom Malaysia",invoiceDate:"2024-10-01",dueDate:"2024-11-01",currency:"MYR",amount:1771,status:"Paid",notes:"Services"},
  {id:"AP-004",entityId:"E002",counterparty:"SG Cowork Space Pte",invoiceDate:"2024-10-01",dueDate:"2024-11-01",currency:"SGD",amount:4665,status:"Paid",notes:"Services"},
  {id:"AP-005",entityId:"E002",counterparty:"Adobe Inc",invoiceDate:"2024-10-01",dueDate:"2024-11-01",currency:"USD",amount:653,status:"Paid",notes:"Services"},
  {id:"AP-006",entityId:"E003",counterparty:"Local Trainer MNL",invoiceDate:"2024-10-01",dueDate:"2024-11-01",currency:"PHP",amount:83815,status:"Paid",notes:"Services"},
  {id:"AP-007",entityId:"E003",counterparty:"Manila Office Supplies",invoiceDate:"2024-10-01",dueDate:"2024-11-01",currency:"PHP",amount:21618,status:"Paid",notes:"Services"},
  {id:"AP-008",entityId:"E001",counterparty:"OTG Singapore Pte",invoiceDate:"2024-11-01",dueDate:"2024-12-01",currency:"SGD",amount:22585,status:"Paid",notes:"Services"},
  {id:"AP-009",entityId:"E001",counterparty:"KL Office Supplies",invoiceDate:"2024-11-01",dueDate:"2024-12-01",currency:"MYR",amount:3579,status:"Paid",notes:"Services"},
  {id:"AP-010",entityId:"E001",counterparty:"Telekom Malaysia",invoiceDate:"2024-11-01",dueDate:"2024-12-01",currency:"MYR",amount:1780,status:"Paid",notes:"Services"},
  {id:"AP-011",entityId:"E002",counterparty:"SG Cowork Space Pte",invoiceDate:"2024-11-01",dueDate:"2024-12-01",currency:"SGD",amount:4845,status:"Paid",notes:"Services"},
  {id:"AP-012",entityId:"E002",counterparty:"Adobe Inc",invoiceDate:"2024-11-01",dueDate:"2024-12-01",currency:"USD",amount:656,status:"Paid",notes:"Services"},
  {id:"AP-013",entityId:"E003",counterparty:"Local Trainer MNL",invoiceDate:"2024-11-01",dueDate:"2024-12-01",currency:"PHP",amount:87114,status:"Paid",notes:"Services"},
  {id:"AP-014",entityId:"E003",counterparty:"Manila Office Supplies",invoiceDate:"2024-11-01",dueDate:"2024-12-01",currency:"PHP",amount:21946,status:"Paid",notes:"Services"},
  {id:"AP-015",entityId:"E001",counterparty:"OTG Singapore Pte",invoiceDate:"2024-12-01",dueDate:"2025-01-01",currency:"SGD",amount:21690,status:"Outstanding",notes:"Services"},
  {id:"AP-016",entityId:"E001",counterparty:"KL Office Supplies",invoiceDate:"2024-12-01",dueDate:"2025-01-01",currency:"MYR",amount:3447,status:"Outstanding",notes:"Services"},
  {id:"AP-017",entityId:"E001",counterparty:"Telekom Malaysia",invoiceDate:"2024-12-01",dueDate:"2025-01-01",currency:"MYR",amount:1807,status:"Outstanding",notes:"Services"},
  {id:"AP-018",entityId:"E002",counterparty:"SG Cowork Space Pte",invoiceDate:"2024-12-01",dueDate:"2025-01-01",currency:"SGD",amount:4732,status:"Outstanding",notes:"Services"},
  {id:"AP-019",entityId:"E002",counterparty:"Adobe Inc",invoiceDate:"2024-12-01",dueDate:"2025-01-01",currency:"USD",amount:663,status:"Outstanding",notes:"Services"},
  {id:"AP-020",entityId:"E003",counterparty:"Local Trainer MNL",invoiceDate:"2024-12-01",dueDate:"2025-01-01",currency:"PHP",amount:87029,status:"Outstanding",notes:"Services"},
  {id:"AP-021",entityId:"E003",counterparty:"Manila Office Supplies",invoiceDate:"2024-12-01",dueDate:"2025-01-01",currency:"PHP",amount:21867,status:"Outstanding",notes:"Services"},
  {id:"AP-022",entityId:"E001",counterparty:"OTG Singapore Pte",invoiceDate:"2025-01-01",dueDate:"2025-02-01",currency:"SGD",amount:21630,status:"Outstanding",notes:"Services"},
  {id:"AP-023",entityId:"E001",counterparty:"KL Office Supplies",invoiceDate:"2025-01-01",dueDate:"2025-02-01",currency:"MYR",amount:3604,status:"Outstanding",notes:"Services"},
  {id:"AP-024",entityId:"E001",counterparty:"Telekom Malaysia",invoiceDate:"2025-01-01",dueDate:"2025-02-01",currency:"MYR",amount:1801,status:"Outstanding",notes:"Services"},
  {id:"AP-025",entityId:"E002",counterparty:"SG Cowork Space Pte",invoiceDate:"2025-01-01",dueDate:"2025-02-01",currency:"SGD",amount:4682,status:"Outstanding",notes:"Services"},
  {id:"AP-026",entityId:"E002",counterparty:"Adobe Inc",invoiceDate:"2025-01-01",dueDate:"2025-02-01",currency:"USD",amount:642,status:"Outstanding",notes:"Services"},
  {id:"AP-027",entityId:"E003",counterparty:"Local Trainer MNL",invoiceDate:"2025-01-01",dueDate:"2025-02-01",currency:"PHP",amount:83009,status:"Outstanding",notes:"Services"},
  {id:"AP-028",entityId:"E003",counterparty:"Manila Office Supplies",invoiceDate:"2025-01-01",dueDate:"2025-02-01",currency:"PHP",amount:22168,status:"Outstanding",notes:"Services"}
];

const MOCK_BUDGET = [
  {entityId:"E001",period:"Jan 2024",accountCode:"4000",budgetMYR:80000},
  {entityId:"E001",period:"Feb 2024",accountCode:"4000",budgetMYR:82000},
  {entityId:"E001",period:"Mar 2024",accountCode:"4000",budgetMYR:95000},
  {entityId:"E001",period:"Apr 2024",accountCode:"4000",budgetMYR:88000},
  {entityId:"E001",period:"May 2024",accountCode:"4000",budgetMYR:100000},
  {entityId:"E001",period:"Jun 2024",accountCode:"4000",budgetMYR:115000},
  {entityId:"E001",period:"Jul 2024",accountCode:"4000",budgetMYR:98000},
  {entityId:"E001",period:"Aug 2024",accountCode:"4000",budgetMYR:105000},
  {entityId:"E001",period:"Sep 2024",accountCode:"4000",budgetMYR:120000},
  {entityId:"E001",period:"Oct 2024",accountCode:"4000",budgetMYR:112000},
  {entityId:"E001",period:"Nov 2024",accountCode:"4000",budgetMYR:88000},
  {entityId:"E001",period:"Dec 2024",accountCode:"4000",budgetMYR:105000},
  {entityId:"E002",period:"Jan 2024",accountCode:"4000",budgetMYR:20000},
  {entityId:"E002",period:"Feb 2024",accountCode:"4000",budgetMYR:21000},
  {entityId:"E002",period:"Mar 2024",accountCode:"4000",budgetMYR:24000},
  {entityId:"E002",period:"Apr 2024",accountCode:"4000",budgetMYR:22000},
  {entityId:"E002",period:"May 2024",accountCode:"4000",budgetMYR:26000},
  {entityId:"E002",period:"Jun 2024",accountCode:"4000",budgetMYR:30000},
  {entityId:"E002",period:"Jul 2024",accountCode:"4000",budgetMYR:24000},
  {entityId:"E002",period:"Aug 2024",accountCode:"4000",budgetMYR:28000},
  {entityId:"E002",period:"Sep 2024",accountCode:"4000",budgetMYR:32000},
  {entityId:"E002",period:"Oct 2024",accountCode:"4000",budgetMYR:30000},
  {entityId:"E002",period:"Nov 2024",accountCode:"4000",budgetMYR:23000},
  {entityId:"E002",period:"Dec 2024",accountCode:"4000",budgetMYR:30000},
  {entityId:"E003",period:"Jan 2024",accountCode:"4000",budgetMYR:640000},
  {entityId:"E003",period:"Feb 2024",accountCode:"4000",budgetMYR:680000},
  {entityId:"E003",period:"Mar 2024",accountCode:"4000",budgetMYR:780000},
  {entityId:"E003",period:"Apr 2024",accountCode:"4000",budgetMYR:750000},
  {entityId:"E003",period:"May 2024",accountCode:"4000",budgetMYR:820000},
  {entityId:"E003",period:"Jun 2024",accountCode:"4000",budgetMYR:900000},
  {entityId:"E003",period:"Jul 2024",accountCode:"4000",budgetMYR:840000},
  {entityId:"E003",period:"Aug 2024",accountCode:"4000",budgetMYR:880000},
  {entityId:"E003",period:"Sep 2024",accountCode:"4000",budgetMYR:960000},
  {entityId:"E003",period:"Oct 2024",accountCode:"4000",budgetMYR:920000},
  {entityId:"E003",period:"Nov 2024",accountCode:"4000",budgetMYR:800000},
  {entityId:"E003",period:"Dec 2024",accountCode:"4000",budgetMYR:940000},
  {entityId:"E001",period:"Jan 2024",accountCode:"5100",budgetMYR:35000},
  {entityId:"E001",period:"Feb 2024",accountCode:"5100",budgetMYR:35000},
  {entityId:"E001",period:"Mar 2024",accountCode:"5100",budgetMYR:38000},
  {entityId:"E001",period:"Apr 2024",accountCode:"5100",budgetMYR:36000},
  {entityId:"E001",period:"May 2024",accountCode:"5100",budgetMYR:40000},
  {entityId:"E001",period:"Jun 2024",accountCode:"5100",budgetMYR:44000},
  {entityId:"E001",period:"Jul 2024",accountCode:"5100",budgetMYR:40000},
  {entityId:"E001",period:"Aug 2024",accountCode:"5100",budgetMYR:42000},
  {entityId:"E001",period:"Sep 2024",accountCode:"5100",budgetMYR:46000},
  {entityId:"E001",period:"Oct 2024",accountCode:"5100",budgetMYR:44000},
  {entityId:"E001",period:"Nov 2024",accountCode:"5100",budgetMYR:36000},
  {entityId:"E001",period:"Dec 2024",accountCode:"5100",budgetMYR:40000},
  {entityId:"E002",period:"Jan 2024",accountCode:"5100",budgetMYR:17000},
  {entityId:"E002",period:"Feb 2024",accountCode:"5100",budgetMYR:17000},
  {entityId:"E002",period:"Mar 2024",accountCode:"5100",budgetMYR:19000},
  {entityId:"E002",period:"Apr 2024",accountCode:"5100",budgetMYR:18000},
  {entityId:"E002",period:"May 2024",accountCode:"5100",budgetMYR:20000},
  {entityId:"E002",period:"Jun 2024",accountCode:"5100",budgetMYR:22000},
  {entityId:"E002",period:"Jul 2024",accountCode:"5100",budgetMYR:20000},
  {entityId:"E002",period:"Aug 2024",accountCode:"5100",budgetMYR:21000},
  {entityId:"E002",period:"Sep 2024",accountCode:"5100",budgetMYR:23000},
  {entityId:"E002",period:"Oct 2024",accountCode:"5100",budgetMYR:22000},
  {entityId:"E002",period:"Nov 2024",accountCode:"5100",budgetMYR:18000},
  {entityId:"E002",period:"Dec 2024",accountCode:"5100",budgetMYR:20000},
  {entityId:"E003",period:"Jan 2024",accountCode:"5100",budgetMYR:250000},
  {entityId:"E003",period:"Feb 2024",accountCode:"5100",budgetMYR:250000},
  {entityId:"E003",period:"Mar 2024",accountCode:"5100",budgetMYR:280000},
  {entityId:"E003",period:"Apr 2024",accountCode:"5100",budgetMYR:265000},
  {entityId:"E003",period:"May 2024",accountCode:"5100",budgetMYR:295000},
  {entityId:"E003",period:"Jun 2024",accountCode:"5100",budgetMYR:325000},
  {entityId:"E003",period:"Jul 2024",accountCode:"5100",budgetMYR:300000},
  {entityId:"E003",period:"Aug 2024",accountCode:"5100",budgetMYR:315000},
  {entityId:"E003",period:"Sep 2024",accountCode:"5100",budgetMYR:340000},
  {entityId:"E003",period:"Oct 2024",accountCode:"5100",budgetMYR:325000},
  {entityId:"E003",period:"Nov 2024",accountCode:"5100",budgetMYR:275000},
  {entityId:"E003",period:"Dec 2024",accountCode:"5100",budgetMYR:300000},
  {entityId:"E001",period:"Jan 2024",accountCode:"5400",budgetMYR:10000},
  {entityId:"E001",period:"Feb 2024",accountCode:"5400",budgetMYR:10000},
  {entityId:"E001",period:"Mar 2024",accountCode:"5400",budgetMYR:11000},
  {entityId:"E001",period:"Apr 2024",accountCode:"5400",budgetMYR:10000},
  {entityId:"E001",period:"May 2024",accountCode:"5400",budgetMYR:12000},
  {entityId:"E001",period:"Jun 2024",accountCode:"5400",budgetMYR:13000},
  {entityId:"E001",period:"Jul 2024",accountCode:"5400",budgetMYR:11000},
  {entityId:"E001",period:"Aug 2024",accountCode:"5400",budgetMYR:12000},
  {entityId:"E001",period:"Sep 2024",accountCode:"5400",budgetMYR:13000},
  {entityId:"E001",period:"Oct 2024",accountCode:"5400",budgetMYR:12000},
  {entityId:"E001",period:"Nov 2024",accountCode:"5400",budgetMYR:10000},
  {entityId:"E001",period:"Dec 2024",accountCode:"5400",budgetMYR:11000},
  {entityId:"E002",period:"Jan 2024",accountCode:"5400",budgetMYR:4500},
  {entityId:"E002",period:"Feb 2024",accountCode:"5400",budgetMYR:4500},
  {entityId:"E002",period:"Mar 2024",accountCode:"5400",budgetMYR:5000},
  {entityId:"E002",period:"Apr 2024",accountCode:"5400",budgetMYR:4800},
  {entityId:"E002",period:"May 2024",accountCode:"5400",budgetMYR:5200},
  {entityId:"E002",period:"Jun 2024",accountCode:"5400",budgetMYR:5800},
  {entityId:"E002",period:"Jul 2024",accountCode:"5400",budgetMYR:5200},
  {entityId:"E002",period:"Aug 2024",accountCode:"5400",budgetMYR:5500},
  {entityId:"E002",period:"Sep 2024",accountCode:"5400",budgetMYR:6000},
  {entityId:"E002",period:"Oct 2024",accountCode:"5400",budgetMYR:5800},
  {entityId:"E002",period:"Nov 2024",accountCode:"5400",budgetMYR:4800},
  {entityId:"E002",period:"Dec 2024",accountCode:"5400",budgetMYR:5200},
  {entityId:"E003",period:"Jan 2024",accountCode:"5400",budgetMYR:70000},
  {entityId:"E003",period:"Feb 2024",accountCode:"5400",budgetMYR:70000},
  {entityId:"E003",period:"Mar 2024",accountCode:"5400",budgetMYR:78000},
  {entityId:"E003",period:"Apr 2024",accountCode:"5400",budgetMYR:75000},
  {entityId:"E003",period:"May 2024",accountCode:"5400",budgetMYR:82000},
  {entityId:"E003",period:"Jun 2024",accountCode:"5400",budgetMYR:90000},
  {entityId:"E003",period:"Jul 2024",accountCode:"5400",budgetMYR:84000},
  {entityId:"E003",period:"Aug 2024",accountCode:"5400",budgetMYR:88000},
  {entityId:"E003",period:"Sep 2024",accountCode:"5400",budgetMYR:95000},
  {entityId:"E003",period:"Oct 2024",accountCode:"5400",budgetMYR:90000},
  {entityId:"E003",period:"Nov 2024",accountCode:"5400",budgetMYR:76000},
  {entityId:"E003",period:"Dec 2024",accountCode:"5400",budgetMYR:84000},
  {entityId:"E001",period:"Jan 2024",accountCode:"5000",budgetMYR:14000},
  {entityId:"E001",period:"Feb 2024",accountCode:"5000",budgetMYR:15000},
  {entityId:"E001",period:"Mar 2024",accountCode:"5000",budgetMYR:17000},
  {entityId:"E001",period:"Apr 2024",accountCode:"5000",budgetMYR:16000},
  {entityId:"E001",period:"May 2024",accountCode:"5000",budgetMYR:18000},
  {entityId:"E001",period:"Jun 2024",accountCode:"5000",budgetMYR:21000},
  {entityId:"E001",period:"Jul 2024",accountCode:"5000",budgetMYR:18000},
  {entityId:"E001",period:"Aug 2024",accountCode:"5000",budgetMYR:19000},
  {entityId:"E001",period:"Sep 2024",accountCode:"5000",budgetMYR:22000},
  {entityId:"E001",period:"Oct 2024",accountCode:"5000",budgetMYR:20000},
  {entityId:"E001",period:"Nov 2024",accountCode:"5000",budgetMYR:16000},
  {entityId:"E001",period:"Dec 2024",accountCode:"5000",budgetMYR:19000},
  {entityId:"E002",period:"Jan 2024",accountCode:"5000",budgetMYR:3600},
  {entityId:"E002",period:"Feb 2024",accountCode:"5000",budgetMYR:3900},
  {entityId:"E002",period:"Mar 2024",accountCode:"5000",budgetMYR:4400},
  {entityId:"E002",period:"Apr 2024",accountCode:"5000",budgetMYR:4000},
  {entityId:"E002",period:"May 2024",accountCode:"5000",budgetMYR:4800},
  {entityId:"E002",period:"Jun 2024",accountCode:"5000",budgetMYR:5600},
  {entityId:"E002",period:"Jul 2024",accountCode:"5000",budgetMYR:4400},
  {entityId:"E002",period:"Aug 2024",accountCode:"5000",budgetMYR:5200},
  {entityId:"E002",period:"Sep 2024",accountCode:"5000",budgetMYR:6000},
  {entityId:"E002",period:"Oct 2024",accountCode:"5000",budgetMYR:5600},
  {entityId:"E002",period:"Nov 2024",accountCode:"5000",budgetMYR:4200},
  {entityId:"E002",period:"Dec 2024",accountCode:"5000",budgetMYR:5600},
  {entityId:"E003",period:"Jan 2024",accountCode:"5000",budgetMYR:104000},
  {entityId:"E003",period:"Feb 2024",accountCode:"5000",budgetMYR:112000},
  {entityId:"E003",period:"Mar 2024",accountCode:"5000",budgetMYR:128000},
  {entityId:"E003",period:"Apr 2024",accountCode:"5000",budgetMYR:122000},
  {entityId:"E003",period:"May 2024",accountCode:"5000",budgetMYR:135000},
  {entityId:"E003",period:"Jun 2024",accountCode:"5000",budgetMYR:148000},
  {entityId:"E003",period:"Jul 2024",accountCode:"5000",budgetMYR:137000},
  {entityId:"E003",period:"Aug 2024",accountCode:"5000",budgetMYR:144000},
  {entityId:"E003",period:"Sep 2024",accountCode:"5000",budgetMYR:157000},
  {entityId:"E003",period:"Oct 2024",accountCode:"5000",budgetMYR:151000},
  {entityId:"E003",period:"Nov 2024",accountCode:"5000",budgetMYR:130000},
  {entityId:"E003",period:"Dec 2024",accountCode:"5000",budgetMYR:153000}
];

const MOCK_SALES = [
  {id:"D001",entityId:"E001",name:"Celestica AI Expansion Phase 2",stage:"Won",value:180000,currency:"MYR",closeDate:"2024-01-31",owner:"Lawrence Liu",product:"AI Solutions",notes:"Renewal + upsell"},
  {id:"D002",entityId:"E001",name:"Petronas Agentic AI Pilot",stage:"Won",value:220000,currency:"MYR",closeDate:"2024-03-31",owner:"Lawrence Liu",product:"AI Solutions",notes:"Signed Q1"},
  {id:"D003",entityId:"E001",name:"RHB Training Programme Q2",stage:"Won",value:92000,currency:"MYR",closeDate:"2024-04-30",owner:"Lawrence Liu",product:"Training",notes:"Full year"},
  {id:"D004",entityId:"E001",name:"Maxis Digital Transformation",stage:"Won",value:165000,currency:"MYR",closeDate:"2024-06-30",owner:"Lawrence Liu",product:"Consulting",notes:"Completed Q2"},
  {id:"D005",entityId:"E001",name:"Hartalega Automation",stage:"Won",value:78000,currency:"MYR",closeDate:"2024-07-31",owner:"Lawrence Liu",product:"Consulting",notes:"Delivered Jul"},
  {id:"D006",entityId:"E001",name:"Top Glove HR Consulting",stage:"Lost",value:55000,currency:"MYR",closeDate:"2024-08-31",owner:"Lawrence Liu",product:"Consulting",notes:"Lost to competitor"},
  {id:"D007",entityId:"E001",name:"OCK FinFlow Implementation",stage:"Won",value:145000,currency:"MYR",closeDate:"2024-09-30",owner:"Lawrence Liu",product:"AI Solutions",notes:"Live Oct 2024"},
  {id:"D008",entityId:"E001",name:"Axiata Leadership Academy",stage:"Won",value:88000,currency:"MYR",closeDate:"2024-10-31",owner:"Lawrence Liu",product:"Training",notes:"Completed Oct"},
  {id:"D009",entityId:"E001",name:"Tenaga AI Workshop",stage:"Won",value:52000,currency:"MYR",closeDate:"2024-11-30",owner:"Lawrence Liu",product:"Training",notes:"Nov delivery"},
  {id:"D010",entityId:"E001",name:"CIMB Agentic AI Boardroom",stage:"Negotiation",value:195000,currency:"MYR",closeDate:"2025-01-31",owner:"Lawrence Liu",product:"AI Solutions",notes:"Term sheet review"},
  {id:"D011",entityId:"E001",name:"Maybank Digital Skills",stage:"Proposal",value:130000,currency:"MYR",closeDate:"2025-02-28",owner:"Lawrence Liu",product:"Training",notes:"Proposal submitted"},
  {id:"D012",entityId:"E001",name:"Sime Darby Consulting",stage:"Qualified",value:175000,currency:"MYR",closeDate:"2025-03-31",owner:"Lawrence Liu",product:"Consulting",notes:"Board approval needed"},
  {id:"D013",entityId:"E001",name:"Maxis Agentic AI Phase 2",stage:"Lead",value:95000,currency:"MYR",closeDate:"2025-04-30",owner:"Lawrence Liu",product:"AI Solutions",notes:"Intro call done"},
  {id:"D014",entityId:"E002",name:"Axiata Group SG AI Lab",stage:"Won",value:28000,currency:"SGD",closeDate:"2024-02-28",owner:"Lawrence Liu",product:"AI Solutions",notes:"SG delivery"},
  {id:"D015",entityId:"E002",name:"DBS Innovation Workshop",stage:"Won",value:18000,currency:"SGD",closeDate:"2024-05-31",owner:"Lawrence Liu",product:"Training",notes:"Completed"},
  {id:"D016",entityId:"E002",name:"Sunway Leadership SG",stage:"Won",value:22000,currency:"SGD",closeDate:"2024-08-31",owner:"Lawrence Liu",product:"Training",notes:"Aug delivery"},
  {id:"D017",entityId:"E002",name:"IHH Healthcare AI",stage:"Won",value:15000,currency:"USD",closeDate:"2024-10-31",owner:"Lawrence Liu",product:"AI Solutions",notes:"Completed Oct"},
  {id:"D018",entityId:"E002",name:"GIC Investment Analytics",stage:"Proposal",value:45000,currency:"SGD",closeDate:"2025-01-31",owner:"Lawrence Liu",product:"Consulting",notes:"Deck submitted"},
  {id:"D019",entityId:"E002",name:"UOB Digital Workforce",stage:"Negotiation",value:38000,currency:"SGD",closeDate:"2025-02-28",owner:"Lawrence Liu",product:"Training",notes:"Contract review"},
  {id:"D020",entityId:"E003",name:"Jollibee HR Consulting",stage:"Won",value:850000,currency:"PHP",closeDate:"2024-01-31",owner:"Lawrence Liu",product:"Consulting",notes:"Phase 1 done"},
  {id:"D021",entityId:"E003",name:"SM Prime AI Workshop",stage:"Won",value:620000,currency:"PHP",closeDate:"2024-04-30",owner:"Lawrence Liu",product:"AI Solutions",notes:"Delivered"},
  {id:"D022",entityId:"E003",name:"Ayala Group Training",stage:"Won",value:480000,currency:"PHP",closeDate:"2024-07-31",owner:"Lawrence Liu",product:"Training",notes:"Completed Jul"},
  {id:"D023",entityId:"E003",name:"BDO Unibank Consulting",stage:"Won",value:390000,currency:"PHP",closeDate:"2024-10-31",owner:"Lawrence Liu",product:"Consulting",notes:"Completed Oct"},
  {id:"D024",entityId:"E003",name:"PLDT Digital Skills",stage:"Proposal",value:720000,currency:"PHP",closeDate:"2025-02-28",owner:"Lawrence Liu",product:"Training",notes:"Final presentation booked"},
  {id:"D025",entityId:"E003",name:"Globe Telecom AI",stage:"Negotiation",value:580000,currency:"PHP",closeDate:"2025-01-31",owner:"Lawrence Liu",product:"AI Solutions",notes:"Commercial terms"},
  {id:"D026",entityId:"E003",name:"Robinsons Retail Ops",stage:"Qualified",value:320000,currency:"PHP",closeDate:"2025-03-31",owner:"Lawrence Liu",product:"Consulting",notes:"Scoping done"}
];

const MOCK_VENDORS_EXTRA = [
  {id:"V006",name:"Tenaga Academy",tradingName:"Tenaga",country:"Malaysia",currency:"MYR",category:"Professional Services",tier:"Preferred",contactName:"Training Director",email:"training@tenaga.com.my",phone:"+60 3 2296 5566",paymentTerms:"Net 30",taxRegNo:"GST123789",bankName:"Maybank",bankAccount:"2233-4455-6677",bankSwift:"MBBEMYKL",status:"Active",riskRating:"Low",isIC:false,entityId:"",notes:"Training content partner",createdAt:"2023-01-01"},
  {id:"V007",name:"AWS Malaysia",tradingName:"AWS",country:"United States",currency:"USD",category:"IT & Technology",tier:"Preferred",contactName:"AWS Support",email:"support@aws.com",phone:"+1 206 266 1000",paymentTerms:"Net 30",taxRegNo:"",bankName:"",bankAccount:"",bankSwift:"",status:"Active",riskRating:"Low",isIC:false,entityId:"",notes:"Cloud infrastructure",createdAt:"2023-01-01"},
  {id:"V008",name:"Grant Thornton MY",tradingName:"Grant Thornton",country:"Malaysia",currency:"MYR",category:"Professional Services",tier:"Approved",contactName:"Partner",email:"audit@gt.com.my",phone:"+60 3 2692 4022",paymentTerms:"Net 60",taxRegNo:"SST987654",bankName:"CIMB",bankAccount:"8899-0011-2233",bankSwift:"CIBBMYKL",status:"Active",riskRating:"Low",isIC:false,entityId:"",notes:"Annual audit firm",createdAt:"2023-01-01"},
  {id:"V009",name:"SG IT Solutions Pte",tradingName:"SG IT",country:"Singapore",currency:"SGD",category:"IT & Technology",tier:"Approved",contactName:"Tech Lead",email:"support@sgit.sg",phone:"+65 6444 7788",paymentTerms:"Net 30",taxRegNo:"GST999888",bankName:"UOB",bankAccount:"3344-556677-88",bankSwift:"UOVBSGSG",status:"Active",riskRating:"Medium",isIC:false,entityId:"",notes:"IT support contractor",createdAt:"2023-01-01"}
];



// ══════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ══════════════════════════════════════════════════════════════════
const P = {
  bg:"#07090F", bg2:"#0C1018", surface:"#111827", surf2:"#0D1520", surf3:"#162032",
  border:"#1E2A3A", bord2:"#243448", gold:"#FAA819", mag:"#B84480",
  text:"#E8EDF5", sub:"#9DAEC4", muted:"#5A6A82",
  green:"#22D3A0", red:"#F43F5E", blue:"#38BDF8", purple:"#A78BFA", orange:"#FB923C",
};
const CCY_LIST = ["MYR","SGD","USD","PHP","IDR","THB","VND"];
const CCY_SYM  = { MYR:"RM",SGD:"S$",USD:"US$",PHP:"₱",IDR:"Rp",THB:"฿",VND:"₫" };
const CCY_CLR  = { MYR:P.mag,SGD:P.gold,USD:P.blue,PHP:P.purple,IDR:P.green,THB:P.orange,VND:P.red };
const BASE = "MYR";
const ENTITY_TYPES  = ["Headquarters","Subsidiary","Branch","JV","Representative Office"];
const COUNTRIES     = ["Malaysia","Singapore","Philippines","Indonesia","Thailand","Vietnam","Myanmar","Cambodia","Laos","Brunei","Australia","China","India","Japan","South Korea","United Kingdom","United States","Other"];
const STATUS_LIST   = ["Outstanding","Overdue","Paid","Disputed"];
const STATUS_CLR    = { Outstanding:P.gold,Overdue:P.red,Paid:P.green,Disputed:P.purple };
const BUCKET_DEF    = ["Current","1–30","31–60","61–90","91–120","120+"];
const BUCKET_CLR    = [P.green,P.gold,P.orange,"#F97316",P.red,"#9F1239"];
const TODAY         = new Date("2025-01-15");
const STORAGE_KEY   = "finflow_v5";

// ── Default budget data (by entity × account × period) ───────────
const DEFAULT_BUDGET = MOCK_BUDGET;
const ENTITY_PALETTE= [P.mag,P.gold,P.purple,P.blue,P.green,P.orange,P.red,"#06B6D4","#F59E0B","#84CC16"];
const PRODUCT_NAME  = "FinFlow";

// ── IFRS Account Classes ──────────────────────────────────────────
const IFRS_CLASSES = [
  { id:"A", label:"Assets",      sign:1,  fxDefault:"closing",  fsLine:"Balance Sheet" },
  { id:"L", label:"Liabilities", sign:-1, fxDefault:"closing",  fsLine:"Balance Sheet" },
  { id:"E", label:"Equity",      sign:-1, fxDefault:"historical",fsLine:"Balance Sheet" },
  { id:"R", label:"Revenue",     sign:-1, fxDefault:"average",   fsLine:"P&L" },
  { id:"X", label:"Expenses",    sign:1,  fxDefault:"average",   fsLine:"P&L" },
];
const FX_METHODS = ["closing","average","historical"];

// ── Standard COA template ─────────────────────────────────────────
const DEFAULT_COA = [
  // Assets
  { code:"1000", name:"Cash & Cash Equivalents",    class:"A", group:"Current Assets",     icEligible:false, fxMethod:"closing",   active:true },
  { code:"1100", name:"Accounts Receivable",        class:"A", group:"Current Assets",     icEligible:true,  fxMethod:"closing",   active:true },
  { code:"1150", name:"IC Receivable",              class:"A", group:"Current Assets",     icEligible:true,  fxMethod:"closing",   active:true },
  { code:"1200", name:"Inventory",                  class:"A", group:"Current Assets",     icEligible:false, fxMethod:"closing",   active:true },
  { code:"1500", name:"Property Plant & Equipment", class:"A", group:"Non-Current Assets", icEligible:false, fxMethod:"closing",   active:true },
  { code:"1600", name:"Intangible Assets",          class:"A", group:"Non-Current Assets", icEligible:false, fxMethod:"historical",active:true },
  // Liabilities
  { code:"2000", name:"Accounts Payable",           class:"L", group:"Current Liabilities",    icEligible:true,  fxMethod:"closing",   active:true },
  { code:"2050", name:"IC Payable",                 class:"L", group:"Current Liabilities",    icEligible:true,  fxMethod:"closing",   active:true },
  { code:"2100", name:"Accrued Liabilities",        class:"L", group:"Current Liabilities",    icEligible:false, fxMethod:"closing",   active:true },
  { code:"2500", name:"Long-Term Debt",             class:"L", group:"Non-Current Liabilities",icEligible:false, fxMethod:"closing",   active:true },
  // Equity
  { code:"3000", name:"Share Capital",              class:"E", group:"Equity",             icEligible:false, fxMethod:"historical",active:true },
  { code:"3100", name:"Retained Earnings",          class:"E", group:"Equity",             icEligible:false, fxMethod:"historical",active:true },
  { code:"3200", name:"Translation Reserve",        class:"E", group:"Equity",             icEligible:false, fxMethod:"closing",   active:true },
  // Revenue
  { code:"4000", name:"Revenue — External",         class:"R", group:"Revenue",            icEligible:false, fxMethod:"average",   active:false },
  { code:"4100", name:"Revenue — Intercompany",     class:"R", group:"Revenue",            icEligible:true,  fxMethod:"average",   active:true },
  { code:"4200", name:"Other Income",               class:"R", group:"Revenue",            icEligible:false, fxMethod:"average",   active:false },
  // Expenses
  { code:"5000", name:"Cost of Sales",              class:"X", group:"Expenses",           icEligible:false, fxMethod:"average",   active:false },
  { code:"5100", name:"Staff Costs",                class:"X", group:"Expenses",           icEligible:false, fxMethod:"average",   active:false },
  { code:"5200", name:"Management Fee Expense",     class:"X", group:"Expenses",           icEligible:true,  fxMethod:"average",   active:true },
  { code:"5300", name:"Depreciation",               class:"X", group:"Expenses",           icEligible:false, fxMethod:"average",   active:false },
  { code:"5400", name:"General & Admin",            class:"X", group:"Expenses",           icEligible:false, fxMethod:"average",   active:false },
  { code:"5500", name:"Finance Costs",              class:"X", group:"Expenses",           icEligible:false, fxMethod:"average",   active:false },
  { code:"4001", name:"Sales Revenue - Domestic",          class:"R", group:"Revenue",       icEligible:false, fxMethod:"average", active:true },
  { code:"4002", name:"Sales Revenue - Export",            class:"R", group:"Revenue",       icEligible:false, fxMethod:"average", active:true },
  { code:"4210", name:"Interest Income",                   class:"R", group:"Non-Operating", icEligible:false, fxMethod:"average", active:true },
  { code:"4211", name:"Forex Income/(loss) - Realised",    class:"R", group:"Non-Operating", icEligible:false, fxMethod:"average", active:true },
  { code:"4212", name:"Forex Income/(loss) - Unrealised",  class:"R", group:"Non-Operating", icEligible:false, fxMethod:"average", active:true },
  { code:"4213", name:"Rebates",                           class:"R", group:"Non-Operating", icEligible:false, fxMethod:"average", active:true },
  { code:"4214", name:"Others",                            class:"R", group:"Non-Operating", icEligible:false, fxMethod:"average", active:true },
  { code:"5001", name:"Direct Materials",                  class:"X", group:"Cost of Sales", icEligible:false, fxMethod:"average", active:true },
  { code:"5002", name:"Direct Labour",                     class:"X", group:"Cost of Sales", icEligible:false, fxMethod:"average", active:true },
  { code:"5101", name:"Staff Cost - Direct",               class:"X", group:"Direct Cost",   icEligible:false, fxMethod:"average", active:true },
  { code:"5102", name:"Staff Cost - Indirect",             class:"X", group:"Direct Cost",   icEligible:false, fxMethod:"average", active:true },
  { code:"5103", name:"Marketing & Selling",               class:"X", group:"Direct Cost",   icEligible:false, fxMethod:"average", active:true },
  { code:"5104", name:"Travelling Expenses",               class:"X", group:"Direct Cost",   icEligible:false, fxMethod:"average", active:true },
  { code:"5110", name:"Manning Cost-Bonus",                class:"X", group:"Staff Reward",  icEligible:false, fxMethod:"average", active:true },
  { code:"5111", name:"Manning Cost-Incentive",            class:"X", group:"Staff Reward",  icEligible:false, fxMethod:"average", active:true },
  { code:"5112", name:"Manning Cost-Staff Reward",         class:"X", group:"Staff Reward",  icEligible:false, fxMethod:"average", active:true },
  { code:"5301", name:"Depreciation Expense",              class:"X", group:"Indirect Cost", icEligible:false, fxMethod:"average", active:true },
  { code:"5401", name:"General & Admin",                   class:"X", group:"Indirect Cost", icEligible:false, fxMethod:"average", active:true },
  { code:"5501", name:"Financing Expenses",                class:"X", group:"Indirect Cost", icEligible:false, fxMethod:"average", active:true },
  { code:"5402", name:"Share of Corp Manning costs",       class:"X", group:"Indirect Cost", icEligible:false, fxMethod:"average", active:true },
  { code:"5403", name:"Share of Corp Manning costs-Bonus", class:"X", group:"Indirect Cost", icEligible:false, fxMethod:"average", active:true },
  { code:"5502", name:"Interest Expense",                  class:"X", group:"Indirect Cost", icEligible:false, fxMethod:"average", active:true },
];

// ── Sample entities ───────────────────────────────────────────────
const DEFAULT_ENTITIES = [
  { id:"E001", name:"Malaysia HQ",        country:"Malaysia",    currency:"MYR", type:"Headquarters",  active:true, color:P.mag    },
  { id:"E002", name:"Singapore Office",   country:"Singapore",   currency:"SGD", type:"Subsidiary",    active:true, color:P.gold   },
  { id:"E003", name:"Philippines Branch", country:"Philippines", currency:"PHP", type:"Branch",        active:true, color:P.purple },
];

// ── Sample FX ─────────────────────────────────────────────────────
const DEFAULT_FX = [
  { period:"Jan 2024", MYR:4.723, SGD:1.338, PHP:56.14, IDR:15680, THB:35.2, VND:24850 },
  { period:"Feb 2024", MYR:4.752, SGD:1.331, PHP:56.80, IDR:15720, THB:35.5, VND:24900 },
  { period:"Mar 2024", MYR:4.728, SGD:1.349, PHP:55.95, IDR:15690, THB:35.3, VND:24870 },
  { period:"Apr 2024", MYR:4.781, SGD:1.358, PHP:57.36, IDR:15810, THB:35.8, VND:25010 },
  { period:"May 2024", MYR:4.706, SGD:1.339, PHP:58.06, IDR:16100, THB:36.2, VND:25340 },
  { period:"Jun 2024", MYR:4.714, SGD:1.344, PHP:58.61, IDR:16240, THB:36.5, VND:25480 },
  { period:"Jul 2024", MYR:4.679, SGD:1.325, PHP:58.32, IDR:16120, THB:36.1, VND:25320 },
  { period:"Aug 2024", MYR:4.428, SGD:1.308, PHP:56.14, IDR:15680, THB:35.0, VND:24780 },
  { period:"Sep 2024", MYR:4.218, SGD:1.296, PHP:56.29, IDR:15540, THB:34.6, VND:24590 },
  { period:"Oct 2024", MYR:4.311, SGD:1.302, PHP:57.97, IDR:15720, THB:34.9, VND:24820 },
  { period:"Nov 2024", MYR:4.473, SGD:1.338, PHP:58.49, IDR:15850, THB:35.2, VND:24950 },
  { period:"Dec 2024", MYR:4.458, SGD:1.346, PHP:57.88, IDR:15790, THB:35.0, VND:24880 },
];

// ── Sample GL journals ────────────────────────────────────────────
const DEFAULT_GL = MOCK_GL; // replaced by rich mock data

const DEFAULT_AR = MOCK_AR;
const DEFAULT_AP = MOCK_AP;

// ── GTM subscription state (org-level, P1 redesign) ──────────────
const DEFAULT_SUBSCRIPTION = {
  tier:"T0",                 // T0 Pilot … T6 Full Suite
  wf01LiveDate:"2024-12-01", // date WF-01 went live (drives Day-30 nudge)
  fcLiteLiveDate:"",         // date FinFlow Lite activated (drives N-04)
  fcProLiveDate:"",          // date FinFlow Pro activated (drives N-05)
  nudgeDismissed:{},         // {nudgeId: ISO date dismissed}
};
function initStore() {
  try {
    const r=localStorage.getItem(STORAGE_KEY);
    if(r){
      const s=JSON.parse(r);
      // Migration: older stores have no subscription block
      if(!s.subscription) s.subscription={...DEFAULT_SUBSCRIPTION};
      return s;
    }
  } catch {}
  return { entities:DEFAULT_ENTITIES, coa:DEFAULT_COA, gl:DEFAULT_GL, fxRates:DEFAULT_FX, ar:DEFAULT_AR, ap:DEFAULT_AP, budget:DEFAULT_BUDGET, sales:DEFAULT_SALES, closeTasks:DEFAULT_CLOSE_TASKS, assets:DEFAULT_ASSETS, headcount:DEFAULT_HEADCOUNT, vendors:DEFAULT_VENDORS, purchaseReqs:DEFAULT_PRS, purchaseOrders:DEFAULT_POS, goodsReceipts:DEFAULT_GRS, supplierInvoices:DEFAULT_INVOICES, paymentRuns:DEFAULT_PAYMENT_RUNS, subscription:{...DEFAULT_SUBSCRIPTION} };
}
function persist(s) { try { localStorage.setItem(STORAGE_KEY,JSON.stringify(s)); } catch {} }

// ══════════════════════════════════════════════════════════════════
// CONTEXT
// ══════════════════════════════════════════════════════════════════
const Ctx = createContext(null);
const useStore = () => useContext(Ctx);

// ══════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════
function getFxRate(fxRates, period, currency) {
  const row = fxRates.find(r=>r.period===period) || fxRates[fxRates.length-1];
  if (!row) return 1;
  if (currency === BASE) return 1;
  if (currency === "USD") return row.MYR || 1;
  const ccyUsd = row[currency]; const myrUsd = row.MYR;
  if (!ccyUsd || !myrUsd) return 1;
  return myrUsd / ccyUsd; // X ccy → MYR
}
function getAvgRate(fxRates, periods, currency) {
  const rates = periods.map(p => getFxRate(fxRates, p, currency)).filter(Boolean);
  return rates.length ? rates.reduce((a,b)=>a+b,0)/rates.length : 1;
}
const fmtMYR = v => "RM "+Number(v).toLocaleString("en-MY",{maximumFractionDigits:0});
const fmtAmt = (v,c) => (CCY_SYM[c]||c)+" "+Number(v).toLocaleString("en-MY",{maximumFractionDigits:0});
const fmtK   = v => Math.abs(v)>=1e6?"RM "+(v/1e6).toFixed(2)+"M":Math.abs(v)>=1000?"RM "+(v/1000).toFixed(0)+"K":fmtMYR(v);
const fmtPct = v => v==null?"—":(v>=0?"+":"")+v.toFixed(2)+"%";
const pct    = (a,b) => (!a||!b)?null:((b-a)/a)*100;
const uid    = () => Math.random().toString(36).slice(2,8).toUpperCase();
const dpd    = due => Math.floor((TODAY-new Date(due))/86400000);
const bkt    = d => d<=0?"Current":d<=30?"1–30":d<=60?"31–60":d<=90?"61–90":d<=120?"91–120":"120+";
const isoM   = d => d?.slice(0,7)||"";
const mLbl   = m => { try{const[y,mo]=m.split("-");return new Date(+y,+mo-1).toLocaleString("default",{month:"short",year:"2-digit"});}catch{return m;} };

// ── GL computation engine ─────────────────────────────────────────
function computeTrialBalance(gl, coa, fxRates, entityId, period, method="configured") {
  const entries = gl.filter(j => j.entityId===entityId && j.period===period);
  const entity  = null; // caller passes entity if needed
  const periods  = fxRates.map(r=>r.period);
  const periodsBefore = periods.filter(p=>p<=period);

  const balances = {};
  entries.forEach(j => {
    const acc = coa.find(a=>a.code===j.drAccount);
    const accCr = coa.find(a=>a.code===j.crAccount);
    if(!balances[j.drAccount]) balances[j.drAccount]={code:j.drAccount,debit:0,credit:0};
    if(!balances[j.crAccount]) balances[j.crAccount]={code:j.crAccount,debit:0,credit:0};
    balances[j.drAccount].debit  += j.amount;
    balances[j.crAccount].credit += j.amount;
  });

  // Translate to MYR
  const tb = Object.values(balances).map(b => {
    const acct = coa.find(a=>a.code===b.code);
    const ccy  = entries[0]?.currency || BASE; // entity functional currency
    const fxM  = acct?.fxMethod || "closing";
    let rate = 1;
    if (fxM === "closing") rate = getFxRate(fxRates, period, ccy);
    else if (fxM === "average") rate = getAvgRate(fxRates, periodsBefore.slice(-3), ccy);
    else rate = getFxRate(fxRates, periods[0], ccy); // historical = first period rate
    const net = b.debit - b.credit;
    return { ...b, accountName:acct?.name||b.code, class:acct?.class||"?", group:acct?.group||"", net, netMYR: net*rate, rate, fxMethod:fxM };
  });
  return tb;
}

function parseCSV(text) {
  return text.split(/\r?\n/).map(line => {
    const cols=[]; let cur="",inQ=false;
    for(const ch of line){if(ch==='"')inQ=!inQ;else if(ch===','&&!inQ){cols.push(cur.trim());cur="";}else cur+=ch;}
    cols.push(cur.trim()); return cols;
  }).filter(r=>r.some(c=>c));
}
async function readFile(file) {
  const ext=file.name.split(".").pop().toLowerCase();
  if(ext==="csv") return parseCSV(await file.text());
  if(ext==="xlsx"||ext==="xls"){const XLSX=await import("xlsx");const wb=XLSX.read(await file.arrayBuffer(),{type:"array"});return parseCSV(XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]));}
  throw new Error("Use .xlsx or .csv");
}

// ══════════════════════════════════════════════════════════════════
// SHARED UI
// ══════════════════════════════════════════════════════════════════
function Card({title,children,style={},accent,noPad}){
  return(
    <div style={{background:P.surface,border:`1px solid ${P.border}`,borderRadius:12,padding:noPad?0:"16px 20px",position:"relative",overflow:"hidden",...style}}>
      {accent&&<div style={{position:"absolute",top:0,left:0,right:0,height:3,background:accent,borderRadius:"12px 12px 0 0"}}/>}
      {title&&<div style={{color:P.muted,fontSize:10,fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase",marginBottom:12,marginTop:accent?6:0,padding:noPad?"14px 18px 0":0}}>{title}</div>}
      <div style={{padding:noPad&&title?"0 18px 14px":noPad?"14px 18px":0}}>{children}</div>
    </div>
  );
}
function KPI({label,value,sub,color=P.gold,accent,small}){
  return(
    <Card accent={accent||color}>
      <div style={{color:P.muted,fontSize:9,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>{label}</div>
      <div style={{fontSize:small?17:22,fontWeight:700,color,fontFamily:"monospace",lineHeight:1.1}}>{value}</div>
      {sub&&<div style={{fontSize:10,color:P.muted,marginTop:3}}>{sub}</div>}
    </Card>
  );
}
function Btn({children,onClick,color=P.gold,outline,small,disabled,danger,style={}}){
  const c=danger?P.red:color;
  return(
    <button onClick={onClick} disabled={disabled} style={{
      background:outline?"transparent":c,color:outline?c:c===P.gold?"#0B0F1A":"#fff",
      border:`1px solid ${c}`,borderRadius:7,padding:small?"4px 10px":"7px 14px",
      cursor:disabled?"not-allowed":"pointer",fontSize:small?11:12,fontWeight:600,
      fontFamily:"inherit",whiteSpace:"nowrap",opacity:disabled?0.5:1,transition:"all 0.15s",...style
    }}>{children}</button>
  );
}
function Input({value,onChange,placeholder,type="text",style={}}){
  return(
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{background:P.surf2,border:`1px solid ${P.border}`,borderRadius:7,color:P.text,
        padding:"7px 11px",fontSize:12,outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box",...style}}/>
  );
}
function Sel({value,onChange,children,style={}}){
  return(
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{background:P.surf2,border:`1px solid ${P.border}`,borderRadius:7,color:P.text,
        padding:"7px 11px",fontSize:12,outline:"none",fontFamily:"inherit",cursor:"pointer",...style}}>
      {children}
    </select>
  );
}
function Badge({label,color}){
  return <span style={{display:"inline-block",padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:700,background:`${color}20`,color,border:`1px solid ${color}40`}}>{label}</span>;
}
function EntityDot({entity,size=8}){
  return entity?<span style={{display:"inline-block",width:size,height:size,borderRadius:"50%",background:entity.color||P.muted,flexShrink:0}}/>:null;
}
function Divider(){return <div style={{height:1,background:P.border,margin:"12px 0"}}/>;}
function SubTabs({tabs,active,onChange}){
  return(
    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:14}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>onChange(t.id)} style={{
          padding:"5px 13px",borderRadius:7,border:`1px solid ${active===t.id?P.gold:P.border}`,
          background:active===t.id?`${P.gold}18`:"transparent",color:active===t.id?P.gold:P.muted,
          fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"
        }}>{t.label}</button>
      ))}
    </div>
  );
}

// ── Period comparison picker ──────────────────────────────────────
function PeriodComparePicker({periods, p1, p2, onP1, onP2, label1="Period A", label2="Period B"}){
  return(
    <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",background:P.surf3,borderRadius:9,padding:"9px 14px",border:`1px solid ${P.bord2}`,marginBottom:14}}>
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M1 8h14M8 1l7 7-7 7" stroke={P.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <span style={{color:P.gold,fontSize:9,fontWeight:700,letterSpacing:2}}>COMPARE PERIODS</span>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <span style={{color:P.muted,fontSize:11}}>{label1}</span>
        <Sel value={p1} onChange={onP1} style={{width:130,fontSize:11,padding:"4px 8px"}}>
          {periods.map(p=><option key={p}>{p}</option>)}
        </Sel>
      </div>
      <span style={{color:P.muted,fontSize:14}}>vs</span>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <span style={{color:P.muted,fontSize:11}}>{label2}</span>
        <Sel value={p2} onChange={onP2} style={{width:130,fontSize:11,padding:"4px 8px"}}>
          {periods.map(p=><option key={p}>{p}</option>)}
        </Sel>
      </div>
    </div>
  );
}

// ── Insight panel wrapper ─────────────────────────────────────────
function InsightPanel({title,children}){
  const [open,setOpen]=useState(true);
  return(
    <div style={{background:P.surf2,border:`1px solid ${P.bord2}`,borderRadius:12,overflow:"hidden",marginBottom:4}}>
      <button onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"10px 16px",background:"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
        <span style={{fontSize:9,color:P.gold}}>◆</span>
        <span style={{color:P.gold,fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",flex:1}}>{title}</span>
        <span style={{color:P.muted,fontSize:12}}>{open?"▲":"▼"}</span>
      </button>
      {open&&<div style={{padding:"0 16px 16px"}}>{children}</div>}
    </div>
  );
}

// ── Delta badge ───────────────────────────────────────────────────
function Delta({current,previous,invert=false,format=v=>fmtMYR(v)}){
  if(previous==null||previous===0) return null;
  const chg=((current-previous)/Math.abs(previous))*100;
  const favourable=invert?chg<=0:chg>=0;
  return(
    <span style={{fontSize:10,color:favourable?P.green:P.red,fontWeight:600,marginLeft:6}}>
      {chg>=0?"▲":"▼"}{Math.abs(chg).toFixed(1)}% vs prior
    </span>
  );
}
function DropZone({onRows,label}){
  const [st,setSt]=useState("idle");const[msg,setMsg]=useState("");const[drag,setDrag]=useState(false);const ref=useRef();
  async function process(file){setSt("loading");setMsg("");try{const rows=await readFile(file);onRows(rows,file.name);setSt("success");setMsg(`✓ ${file.name}`);}catch(e){setSt("error");setMsg(`✗ ${e.message}`);}}
  const bc=drag?P.gold:st==="success"?P.green:st==="error"?P.red:P.border;
  return(
    <div onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)}
      onDrop={e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f)process(f);}}
      onClick={()=>ref.current?.click()}
      style={{border:`2px dashed ${bc}`,borderRadius:10,padding:"18px 14px",textAlign:"center",cursor:"pointer",background:drag?`${P.gold}08`:P.surf2,transition:"all 0.18s",userSelect:"none"}}>
      <input ref={ref} type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f)process(f);e.target.value="";}}/>
      {st==="loading"?<div style={{color:P.muted,fontSize:12}}>Reading…</div>
      :st==="success"?<div style={{color:P.green,fontSize:12,fontWeight:600}}>{msg} · click to replace</div>
      :st==="error"?<div style={{color:P.red,fontSize:11}}>{msg}</div>
      :<div><div style={{color:P.text,fontSize:12,fontWeight:600,marginBottom:3}}>{drag?"Drop to import":label||"Drop file or click"}</div><div style={{color:P.muted,fontSize:10}}>.xlsx · .csv</div></div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// GLOBAL FILTERS (sidebar)
// ══════════════════════════════════════════════════════════════════
function GlobalFilters({store,gf,setGf}){
  const {entities,fxRates}=store;
  const allPeriods=useMemo(()=>fxRates.map(r=>r.period),[fxRates]);
  const activeE=entities.filter(e=>e.active);
  function toggleE(id){setGf(f=>({...f,entityIds:f.entityIds.includes(id)?f.entityIds.filter(x=>x!==id):[...f.entityIds,id]}));}
  const isF=gf.periodFrom||gf.periodTo||gf.entityIds.length<activeE.length;
  return(
    <div style={{padding:"12px 14px",borderBottom:`1px solid ${P.border}`,background:P.bg2}}>
      <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:10,flexWrap:"wrap"}}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}><path d="M1 3h14M4 8h8M7 13h2" stroke={P.gold} strokeWidth="1.5" strokeLinecap="round"/></svg>
        <span style={{color:P.gold,fontSize:9,fontWeight:700,letterSpacing:2}}>PERIOD</span>
        <Sel value={gf.periodFrom} onChange={v=>setGf(f=>({...f,periodFrom:v}))} style={{fontSize:10,padding:"3px 7px",flex:1}}>
          <option value="">From</option>{allPeriods.map(p=><option key={p}>{p}</option>)}
        </Sel>
        <span style={{color:P.muted,fontSize:10}}>→</span>
        <Sel value={gf.periodTo} onChange={v=>setGf(f=>({...f,periodTo:v}))} style={{fontSize:10,padding:"3px 7px",flex:1}}>
          <option value="">To</option>{allPeriods.map(p=><option key={p}>{p}</option>)}
        </Sel>
      </div>
      <div style={{marginBottom:8}}>
        <div style={{color:P.gold,fontSize:9,fontWeight:700,letterSpacing:2,marginBottom:6}}>ENTITIES</div>
        <div style={{display:"flex",flexDirection:"column",gap:3}}>
          {activeE.map(e=>{const on=gf.entityIds.includes(e.id);return(
            <button key={e.id} onClick={()=>toggleE(e.id)} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 8px",borderRadius:7,border:`1px solid ${on?e.color:P.border}`,background:on?`${e.color}15`:"transparent",cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all 0.12s"}}>
              <EntityDot entity={e} size={6}/><span style={{color:on?e.color:P.muted,fontSize:11,fontWeight:on?600:400,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.name}</span>
              <span style={{color:P.muted,fontSize:9}}>{e.currency}</span>
            </button>
          );})}
        </div>
      </div>
      <div style={{display:"flex",gap:5,alignItems:"center"}}>
        <button onClick={()=>setGf(f=>({...f,entityIds:activeE.map(e=>e.id)}))} style={{background:"transparent",border:`1px solid ${P.border}`,borderRadius:5,color:P.muted,fontSize:10,padding:"2px 7px",cursor:"pointer",fontFamily:"inherit"}}>All</button>
        <button onClick={()=>setGf(f=>({...f,entityIds:[]}))} style={{background:"transparent",border:`1px solid ${P.border}`,borderRadius:5,color:P.muted,fontSize:10,padding:"2px 7px",cursor:"pointer",fontFamily:"inherit"}}>None</button>
        {isF&&<button onClick={()=>setGf({periodFrom:"",periodTo:"",entityIds:activeE.map(e=>e.id)})} style={{background:"transparent",border:`1px solid ${P.red}40`,borderRadius:5,color:P.red,fontSize:10,padding:"2px 7px",cursor:"pointer",fontFamily:"inherit",marginLeft:"auto"}}>Clear ✕</button>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MODULE: ENTITIES
// ══════════════════════════════════════════════════════════════════
function EntityModule(){
  const {store,setStore}=useStore();
  const {entities}=store;
  const BLANK={id:"",name:"",country:"Malaysia",currency:"MYR",type:"Subsidiary",active:true,color:ENTITY_PALETTE[0]};
  const [form,setForm]=useState(BLANK);const[editing,setEditing]=useState(null);
  function save(){
    if(!form.name.trim())return;
    const updated=editing?entities.map(e=>e.id===editing?{...form,id:editing}:e):[...entities,{...form,id:"E"+uid()}];
    const ns={...store,entities:updated};setStore(ns);persist(ns);setForm(BLANK);setEditing(null);
  }
  function startEdit(e){setForm({...e});setEditing(e.id);}
  function remove(id){if(!window.confirm("Remove entity?"))return;const ns={...store,entities:entities.filter(e=>e.id!==id)};setStore(ns);persist(ns);}
  function toggleActive(id){const ns={...store,entities:entities.map(e=>e.id===id?{...e,active:!e.active}:e)};setStore(ns);persist(ns);}
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,alignItems:"start"}}>
        <Card title={editing?"Edit Entity":"Add Entity"} accent={editing?P.gold:P.green}>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div><div style={{color:P.muted,fontSize:10,marginBottom:4}}>ENTITY NAME *</div><Input value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Singapore Operations"/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><div style={{color:P.muted,fontSize:10,marginBottom:4}}>COUNTRY</div><Sel value={form.country} onChange={v=>setForm(f=>({...f,country:v}))} style={{width:"100%"}}>{COUNTRIES.map(c=><option key={c}>{c}</option>)}</Sel></div>
              <div><div style={{color:P.muted,fontSize:10,marginBottom:4}}>FUNCTIONAL CURRENCY</div><Sel value={form.currency} onChange={v=>setForm(f=>({...f,currency:v}))} style={{width:"100%"}}>{CCY_LIST.map(c=><option key={c}>{c}</option>)}</Sel></div>
            </div>
            <div><div style={{color:P.muted,fontSize:10,marginBottom:4}}>ENTITY TYPE</div><Sel value={form.type} onChange={v=>setForm(f=>({...f,type:v}))} style={{width:"100%"}}>{ENTITY_TYPES.map(t=><option key={t}>{t}</option>)}</Sel></div>
            <div>
              <div style={{color:P.muted,fontSize:10,marginBottom:6}}>COLOUR TAG</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{ENTITY_PALETTE.map(c=><button key={c} onClick={()=>setForm(f=>({...f,color:c}))} style={{width:22,height:22,borderRadius:"50%",background:c,border:`2px solid ${form.color===c?"#fff":"transparent"}`,cursor:"pointer",outline:"none"}}/>)}</div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:4}}>
              <Btn onClick={save} style={{flex:1}}>{editing?"Save Changes":"Add Entity"}</Btn>
              {editing&&<Btn onClick={()=>{setForm(BLANK);setEditing(null);}} outline color={P.muted}>Cancel</Btn>}
            </div>
          </div>
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{color:P.muted,fontSize:10,fontFamily:"monospace",letterSpacing:2,textTransform:"uppercase"}}>Entities ({entities.length})</div>
          {entities.map(e=>{
            const arC=store.ar.filter(r=>r.entityId===e.id).length;
            const apC=store.ap.filter(r=>r.entityId===e.id).length;
            const glC=store.gl.filter(r=>r.entityId===e.id).length;
            return(
              <div key={e.id} style={{background:P.surf2,border:`1px solid ${e.active?e.color+"40":P.border}`,borderRadius:10,padding:"11px 13px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                  <div style={{width:9,height:9,borderRadius:"50%",background:e.color,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{color:e.active?P.text:P.muted,fontWeight:600,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.name}</div>
                    <div style={{color:P.muted,fontSize:10}}>{e.id} · {e.country} · {e.currency} · {e.type}</div>
                  </div>
                  <div style={{display:"flex",gap:5}}>
                    <Btn onClick={()=>toggleActive(e.id)} small outline color={e.active?P.green:P.muted}>{e.active?"Active":"Inactive"}</Btn>
                    <Btn onClick={()=>startEdit(e)} small outline color={P.gold}>Edit</Btn>
                    <Btn onClick={()=>remove(e.id)} small outline danger>✕</Btn>
                  </div>
                </div>
                <div style={{display:"flex",gap:12,fontSize:10,color:P.muted}}>
                  <span>GL: <span style={{color:P.blue}}>{glC}</span></span>
                  <span>AR: <span style={{color:P.green}}>{arC}</span></span>
                  <span>AP: <span style={{color:P.mag}}>{apC}</span></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MODULE: COA
// ══════════════════════════════════════════════════════════════════
function COAModule(){
  const {store,setStore}=useStore();
  const {coa}=store;
  const [tab,setTab]=useState("accounts");
  const [filter,setFilter]=useState("");const[fClass,setFClass]=useState("All");
  const BLANK={code:"",name:"",class:"A",group:"",icEligible:false,fxMethod:"closing",active:true};
  const [form,setForm]=useState(BLANK);const[editing,setEditing]=useState(null);

  function save(){
    if(!form.code||!form.name)return;
    const updated=editing?coa.map(a=>a.code===editing?{...form}:a):[...coa,{...form}];
    const ns={...store,coa:updated};setStore(ns);persist(ns);setForm(BLANK);setEditing(null);
  }
  function toggleActive(code){const ns={...store,coa:coa.map(a=>a.code===code?{...a,active:!a.active}:a)};setStore(ns);persist(ns);}
  function remove(code){if(!window.confirm("Remove account?"))return;const ns={...store,coa:coa.filter(a=>a.code!==code)};setStore(ns);persist(ns);}
  function updateFxMethod(code,m){const ns={...store,coa:coa.map(a=>a.code===code?{...a,fxMethod:m}:a)};setStore(ns);persist(ns);}

  const filtered=coa
    .filter(a=>fClass==="All"||a.class===fClass)
    .filter(a=>!filter||a.code.includes(filter)||a.name.toLowerCase().includes(filter.toLowerCase())||a.group.toLowerCase().includes(filter.toLowerCase()))
    .sort((a,b)=>a.code.localeCompare(b.code));

  function handleUpload(rows){
    const hdrs=rows[0].map(h=>h.trim().toUpperCase());
    const col=k=>hdrs.findIndex(h=>h===k);
    const parsed=rows.slice(1).map(r=>({
      code:r[col("CODE")]||"",name:r[col("NAME")]||"",class:r[col("CLASS")]||"A",
      group:r[col("GROUP")]||"",icEligible:(r[col("ICELIGIBLE")]||"").toLowerCase()==="true",
      fxMethod:r[col("FXMETHOD")]||"closing",active:true,
    })).filter(r=>r.code&&r.name);
    const ns={...store,coa:parsed};setStore(ns);persist(ns);
  }

  function downloadTemplate(){
    const hdr="Code,Name,Class,Group,ICEligible,FXMethod\n";
    const ex="1000,Cash & Equivalents,A,Current Assets,false,closing\n4000,Revenue External,R,Revenue,false,average";
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([hdr+ex],{type:"text/csv"}));a.download="coa_template.csv";a.click();
  }

  const clsCls = IFRS_CLASSES.find(c=>c.id===form.class);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <SubTabs tabs={[{id:"accounts",label:"Accounts"},{id:"classes",label:"Class Settings"},{id:"upload",label:"Upload / Template"}]} active={tab} onChange={setTab}/>

      {tab==="accounts"&&(
        <>
        {/* Summary by class */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
          {IFRS_CLASSES.map(cl=>{
            const count=coa.filter(a=>a.class===cl.id&&a.active).length;
            const clr=cl.id==="A"?P.blue:cl.id==="L"?P.orange:cl.id==="E"?P.purple:cl.id==="R"?P.green:P.red;
            return(<div key={cl.id} style={{background:P.surf2,border:`1px solid ${clr}40`,borderRadius:9,padding:"10px 12px"}}>
              <div style={{color:clr,fontSize:9,fontWeight:700,letterSpacing:1,marginBottom:3}}>{cl.label.toUpperCase()}</div>
              <div style={{color:P.text,fontSize:18,fontWeight:700}}>{count}</div>
              <div style={{color:P.muted,fontSize:9,marginTop:2}}>{cl.fsLine} · {cl.fxDefault}</div>
            </div>);
          })}
        </div>

        {/* Filters */}
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <Input value={filter} onChange={setFilter} placeholder="Search code or name…" style={{width:200}}/>
          <Sel value={fClass} onChange={setFClass} style={{width:140}}>
            <option value="All">All Classes</option>{IFRS_CLASSES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
          </Sel>
          <span style={{fontSize:11,color:P.muted,marginLeft:"auto"}}>{filtered.length} accounts</span>
        </div>

        {/* Add/Edit form inline */}
        <Card title={editing?"Edit Account":"Add Account"} accent={editing?P.gold:P.green}>
          <div style={{display:"grid",gridTemplateColumns:"120px 1fr 100px 1fr 120px 120px auto",gap:8,alignItems:"end"}}>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>CODE *</div><Input value={form.code} onChange={v=>setForm(f=>({...f,code:v}))} placeholder="e.g.1100"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>ACCOUNT NAME *</div><Input value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="Account name"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>CLASS</div><Sel value={form.class} onChange={v=>setForm(f=>({...f,class:v}))} style={{width:"100%"}}>{IFRS_CLASSES.map(c=><option key={c.id} value={c.id}>{c.id} – {c.label}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>GROUP</div><Input value={form.group} onChange={v=>setForm(f=>({...f,group:v}))} placeholder="e.g. Current Assets"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>FX METHOD</div><Sel value={form.fxMethod} onChange={v=>setForm(f=>({...f,fxMethod:v}))} style={{width:"100%"}}>{FX_METHODS.map(m=><option key={m}>{m}</option>)}</Sel></div>
            <div style={{display:"flex",alignItems:"center",gap:6,paddingTop:16}}>
              <input type="checkbox" checked={form.icEligible} onChange={e=>setForm(f=>({...f,icEligible:e.target.checked}))} id="ic"/>
              <label htmlFor="ic" style={{color:P.muted,fontSize:11,cursor:"pointer"}}>IC eligible</label>
            </div>
            <div style={{display:"flex",gap:6,paddingTop:16}}>
              <Btn onClick={save} small>{editing?"Save":"Add"}</Btn>
              {editing&&<Btn onClick={()=>{setForm(BLANK);setEditing(null);}} small outline color={P.muted}>✕</Btn>}
            </div>
          </div>
        </Card>

        {/* Accounts table */}
        <Card noPad>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:P.surf2}}>
                {["Code","Account Name","Class","Group","IC","FX Method","Status",""].map(h=>(
                  <th key={h} style={{textAlign:"left",padding:"8px 10px",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{filtered.map((a,i)=>{
                const cl=IFRS_CLASSES.find(c=>c.id===a.class);
                const clr=a.class==="A"?P.blue:a.class==="L"?P.orange:a.class==="E"?P.purple:a.class==="R"?P.green:P.red;
                return(
                  <tr key={a.code} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}12`,opacity:a.active?1:0.45}}>
                    <td style={{padding:"7px 10px",fontFamily:"monospace",color:P.gold,fontWeight:700,fontSize:11}}>{a.code}</td>
                    <td style={{padding:"7px 10px",color:P.text}}>{a.name}</td>
                    <td style={{padding:"7px 10px"}}><Badge label={`${a.class} ${cl?.label||""}`} color={clr}/></td>
                    <td style={{padding:"7px 10px",color:P.sub,fontSize:11}}>{a.group}</td>
                    <td style={{padding:"7px 10px",textAlign:"center"}}>{a.icEligible?<span style={{color:P.green,fontSize:11}}>✓</span>:<span style={{color:P.border}}>—</span>}</td>
                    <td style={{padding:"7px 10px"}}>
                      <Sel value={a.fxMethod} onChange={v=>updateFxMethod(a.code,v)} style={{fontSize:10,padding:"2px 6px",width:90}}>
                        {FX_METHODS.map(m=><option key={m}>{m}</option>)}
                      </Sel>
                    </td>
                    <td style={{padding:"7px 10px"}}><Badge label={a.active?"Active":"Inactive"} color={a.active?P.green:P.muted}/></td>
                    <td style={{padding:"7px 10px"}}>
                      <div style={{display:"flex",gap:5}}>
                        <Btn onClick={()=>{setForm({...a});setEditing(a.code);}} small outline color={P.gold}>Edit</Btn>
                        <Btn onClick={()=>toggleActive(a.code)} small outline color={a.active?P.muted:P.green}>{a.active?"Deactivate":"Activate"}</Btn>
                        <Btn onClick={()=>remove(a.code)} small outline danger>✕</Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </Card>
        </>
      )}

      {tab==="classes"&&(
        <Card title="Class FX Translation Settings">
          <div style={{fontSize:11,color:P.muted,marginBottom:14}}>
            These are the IFRS-standard translation methods per account class. Override per account in the Accounts tab.
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>{["Class","Financial Statement","Dr/Cr Convention","Default FX Method","Accounts"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 10px",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1}}>{h}</th>)}</tr></thead>
            <tbody>{IFRS_CLASSES.map(cl=>{
              const clr=cl.id==="A"?P.blue:cl.id==="L"?P.orange:cl.id==="E"?P.purple:cl.id==="R"?P.green:P.red;
              const cnt=coa.filter(a=>a.class===cl.id&&a.active).length;
              return(
                <tr key={cl.id} style={{borderBottom:`1px solid ${P.border}20`}}>
                  <td style={{padding:"10px"}}><Badge label={`${cl.id} – ${cl.label}`} color={clr}/></td>
                  <td style={{padding:"10px",color:P.sub,fontSize:11}}>{cl.fsLine}</td>
                  <td style={{padding:"10px",color:P.muted,fontSize:11}}>{cl.sign===1?"Debit normal":"Credit normal"}</td>
                  <td style={{padding:"10px"}}><Badge label={cl.fxDefault} color={P.gold}/></td>
                  <td style={{padding:"10px",color:P.text,fontFamily:"monospace"}}>{cnt}</td>
                </tr>
              );
            })}</tbody>
          </table>
          <Divider/>
          <div style={{fontSize:11,color:P.muted}}>
            <strong style={{color:P.gold}}>Closing rate</strong> — Balance sheet date rate · applied to BS accounts (Assets, Liabilities)<br/>
            <strong style={{color:P.gold}}>Average rate</strong> — Period average rate · applied to P&L accounts (Revenue, Expenses)<br/>
            <strong style={{color:P.gold}}>Historical rate</strong> — Rate at transaction date · applied to Equity items and non-monetary assets
          </div>
        </Card>
      )}

      {tab==="upload"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card title="Upload Chart of Accounts">
            <DropZone onRows={handleUpload} label="Drop COA file (.xlsx or .csv)"/>
            <div style={{marginTop:8,fontSize:10,color:P.muted}}>Required: <span style={{color:P.gold}}>Code, Name, Class (A/L/E/R/X), Group, ICEligible (true/false), FXMethod (closing/average/historical)</span></div>
            <button onClick={downloadTemplate} style={{marginTop:8,background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,color:P.muted,fontSize:10,padding:"4px 10px",cursor:"pointer",fontFamily:"inherit"}}>↓ Download COA Template</button>
          </Card>
          <Card title="Standard IFRS Template" accent={P.blue}>
            <div style={{fontSize:11,color:P.muted,marginBottom:10}}>The app loads a standard IFRS COA by default. Customise account codes, names and groupings to match your client's numbering convention.</div>
            <Btn onClick={()=>{const ns={...store,coa:DEFAULT_COA};setStore(ns);persist(ns);}} outline color={P.blue}>Reset to Standard IFRS Template</Btn>
          </Card>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MODULE: GL LEDGER
// ══════════════════════════════════════════════════════════════════
function GLModule({gf}){
  const {store,setStore}=useStore();
  const {gl,coa,entities,fxRates}=store;
  const [tab,setTab]=useState("journal");
  const [fEntity,setFEntity]=useState(gf.entityIds[0]||entities[0]?.id||"");
  const [fPeriod,setFPeriod]=useState(gf.periodTo||fxRates[fxRates.length-1]?.period||"");

  const activeE=entities.filter(e=>e.active&&gf.entityIds.includes(e.id));
  if(activeE.length&&!activeE.find(e=>e.id===fEntity)){setFEntity(activeE[0].id);}

  const JBLANK={ref:"",description:"",drAccount:"",crAccount:"",currency:"MYR",amount:"",icEntityId:"",date:new Date().toISOString().slice(0,10)};
  const [jform,setJform]=useState(JBLANK);
  const [jerr,setJerr]=useState("");

  const periods=fxRates.map(r=>r.period);
  const entity=entities.find(e=>e.id===fEntity);

  // ── Period comparison ─────────────────────────────────────────────
  const lastTwo=periods.slice(-2);
  const [cmpP1,setCmpP1]=useState(lastTwo[0]||periods[0]||"");
  const [cmpP2,setCmpP2]=useState(lastTwo[1]||periods[0]||"");

  // Filtered journals
  const journals=gl.filter(j=>(!fEntity||j.entityId===fEntity)&&(!fPeriod||j.period===fPeriod));

  // Compute trial balance
  const tb=useMemo(()=>{
    if(!fEntity||!fPeriod) return [];
    return computeTrialBalance(gl,coa,fxRates,fEntity,fPeriod);
  },[gl,coa,fxRates,fEntity,fPeriod]);

  const totDr=journals.reduce((s,j)=>s+j.amount,0);
  const totCr=journals.reduce((s,j)=>s+j.amount,0); // every entry has matching Dr=Cr
  const tbDr=tb.reduce((s,r)=>s+(r.debit||0),0);
  const tbCr=tb.reduce((s,r)=>s+(r.credit||0),0);
  const balanced=Math.abs(tbDr-tbCr)<0.01;

  function addJournal(){
    setJerr("");
    if(!jform.ref||!jform.description||!jform.drAccount||!jform.crAccount||!jform.amount){setJerr("All fields required");return;}
    if(jform.drAccount===jform.crAccount){setJerr("Dr and Cr accounts must differ");return;}
    if(!coa.find(a=>a.code===jform.drAccount)){setJerr(`Dr account ${jform.drAccount} not found in COA`);return;}
    if(!coa.find(a=>a.code===jform.crAccount)){setJerr(`Cr account ${jform.crAccount} not found in COA`);return;}
    const entry={
      id:"JE"+uid(),entityId:fEntity,period:fPeriod,date:jform.date,
      ref:jform.ref,description:jform.description,
      drAccount:jform.drAccount,crAccount:jform.crAccount,
      currency:entity?.currency||"MYR",amount:parseFloat(jform.amount),
      icEntityId:jform.icEntityId||null,
    };
    const ns={...store,gl:[...gl,entry]};setStore(ns);persist(ns);setJform(JBLANK);
  }

  function removeJournal(id){const ns={...store,gl:gl.filter(j=>j.id!==id)};setStore(ns);persist(ns);}

  function handleUpload(rows){
    const hdrs=rows[0].map(h=>h.trim().toUpperCase());
    const col=k=>hdrs.findIndex(h=>h===k);
    const parsed=rows.slice(1).map(r=>({
      id:"JE"+uid(),
      entityId:r[col("ENTITYID")]||fEntity,
      period:r[col("PERIOD")]||fPeriod,
      date:r[col("DATE")]||"",
      ref:r[col("REF")]||"",
      description:r[col("DESCRIPTION")]||"",
      drAccount:r[col("DRACCOUNT")]||"",
      crAccount:r[col("CRACCOUNT")]||"",
      currency:r[col("CURRENCY")]||entity?.currency||"MYR",
      amount:parseFloat(r[col("AMOUNT")])||0,
      icEntityId:r[col("ICENTITYID")]||null,
    })).filter(r=>r.drAccount&&r.crAccount&&r.amount);
    const ns={...store,gl:[...gl,...parsed]};setStore(ns);persist(ns);
  }

  function dlTemplate(){
    const hdr="EntityId,Period,Date,Ref,Description,DrAccount,CrAccount,Currency,Amount,ICEntityId\n";
    const ex=`${fEntity},${fPeriod},2025-01-31,SLS-001,Revenue recognition,1100,4000,${entity?.currency||"MYR"},50000,\n${fEntity},${fPeriod},2025-01-31,EXP-001,Staff costs,5100,2000,${entity?.currency||"MYR"},20000,`;
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([hdr+ex],{type:"text/csv"}));a.download="gl_template.csv";a.click();
  }

  const acctName=code=>coa.find(a=>a.code===code)?.name||code;
  const acctClass=code=>{const cl=coa.find(a=>a.code===code)?.class;return cl?IFRS_CLASSES.find(c=>c.id===cl)?.label||cl:"";}

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Entity + period selector */}
      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",background:P.surf2,borderRadius:10,padding:"10px 14px",border:`1px solid ${P.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:P.muted,fontSize:11}}>Entity</span>
          <Sel value={fEntity} onChange={setFEntity} style={{width:180}}>
            {activeE.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
          </Sel>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:P.muted,fontSize:11}}>Period</span>
          <Sel value={fPeriod} onChange={setFPeriod} style={{width:130}}>
            {periods.map(p=><option key={p}>{p}</option>)}
          </Sel>
        </div>
        {entity&&<div style={{display:"flex",alignItems:"center",gap:6,marginLeft:8}}><EntityDot entity={entity} size={8}/><span style={{color:entity.color,fontSize:11,fontWeight:600}}>{entity.currency}</span><span style={{color:P.muted,fontSize:10}}>functional currency</span></div>}
        <div style={{marginLeft:"auto",fontSize:11,color:balanced?P.green:P.red,fontWeight:600}}>
          {balanced?"✓ TB Balanced":`⚠ TB Out of Balance — Dr ${fmtMYR(tbDr)} ≠ Cr ${fmtMYR(tbCr)}`}
        </div>
      </div>

      <SubTabs tabs={[{id:"journal",label:"Journal Entries"},{id:"tb",label:"Trial Balance"},{id:"insights",label:"📊 Insights"},{id:"upload",label:"Upload"}]} active={tab} onChange={setTab}/>

      {tab==="insights"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <PeriodComparePicker periods={periods} p1={cmpP1} p2={cmpP2} onP1={setCmpP1} onP2={setCmpP2}/>

          {/* Activity trend — journal count + volume by period across all filtered entities */}
          {(()=>{
            const trendData=periods.map(p=>{
              const pJournals=gl.filter(j=>gf.entityIds.includes(j.entityId)&&j.period===p);
              const vol=pJournals.reduce((s,j)=>s+j.amount*getFxRate(fxRates,p,entities.find(e=>e.id===j.entityId)?.currency||BASE),0);
              return{period:p,entries:pJournals.length,volumeMYR:vol};
            });
            const p1Data=trendData.find(d=>d.period===cmpP1);
            const p2Data=trendData.find(d=>d.period===cmpP2);
            return(
              <InsightPanel title="GL Activity Trend — Journal Volume & Entry Count">
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                  <div style={{background:P.surf3,borderRadius:8,padding:"10px 14px",border:`1px solid ${P.bord2}`}}>
                    <div style={{color:P.muted,fontSize:9,marginBottom:4}}>{cmpP1} — JOURNAL ENTRIES</div>
                    <div style={{fontSize:18,fontWeight:700,color:P.blue,fontFamily:"monospace"}}>{p1Data?.entries||0}</div>
                    <div style={{fontSize:11,color:P.gold,marginTop:2}}>{fmtK(p1Data?.volumeMYR||0)}</div>
                  </div>
                  <div style={{background:P.surf3,borderRadius:8,padding:"10px 14px",border:`1px solid ${P.bord2}`}}>
                    <div style={{color:P.muted,fontSize:9,marginBottom:4}}>{cmpP2} — JOURNAL ENTRIES</div>
                    <div style={{fontSize:18,fontWeight:700,color:P.gold,fontFamily:"monospace"}}>{p2Data?.entries||0}<Delta current={p2Data?.entries||0} previous={p1Data?.entries||0}/></div>
                    <div style={{fontSize:11,color:P.gold,marginTop:2}}>{fmtK(p2Data?.volumeMYR||0)}<Delta current={p2Data?.volumeMYR||0} previous={p1Data?.volumeMYR||0}/></div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={trendData} margin={{top:0,right:16,left:0,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                    <XAxis dataKey="period" tick={{fill:P.muted,fontSize:9}}/>
                    <YAxis yAxisId="left" tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                    <YAxis yAxisId="right" orientation="right" tick={{fill:P.muted,fontSize:9}}/>
                    <Tooltip formatter={(v,n)=>n==="volumeMYR"?[fmtMYR(v),"Volume"]:v} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                    <Bar yAxisId="left" dataKey="volumeMYR" name="Volume (MYR)" fill={`${P.blue}60`} radius={[3,3,0,0]}>
                      {trendData.map((d,i)=><Cell key={i} fill={d.period===cmpP1||d.period===cmpP2?P.gold:`${P.blue}60`}/>)}
                    </Bar>
                    <Line yAxisId="right" type="monotone" dataKey="entries" stroke={P.green} strokeWidth={2} dot={{r:3,fill:P.green}} name="Entries"/>
                  </BarChart>
                </ResponsiveContainer>
              </InsightPanel>
            );
          })()}

          {/* Top accounts by debit volume — period comparison */}
          {(()=>{
            const getTopAccts=(period)=>{
              const map={};
              gl.filter(j=>gf.entityIds.includes(j.entityId)&&j.period===period).forEach(j=>{
                const rate=getFxRate(fxRates,period,entities.find(e=>e.id===j.entityId)?.currency||BASE);
                const myr=j.amount*rate;
                if(!map[j.drAccount])map[j.drAccount]={code:j.drAccount,name:coa.find(a=>a.code===j.drAccount)?.name||j.drAccount,dr:0,cr:0};
                map[j.drAccount].dr+=myr;
                if(!map[j.crAccount])map[j.crAccount]={code:j.crAccount,name:coa.find(a=>a.code===j.crAccount)?.name||j.crAccount,dr:0,cr:0};
                map[j.crAccount].cr+=myr;
              });
              return Object.values(map).sort((a,b)=>(b.dr+b.cr)-(a.dr+a.cr)).slice(0,6);
            };
            const t1=getTopAccts(cmpP1),t2=getTopAccts(cmpP2);
            const allCodes=[...new Set([...t1.map(a=>a.code),...t2.map(a=>a.code)])];
            const chartData=allCodes.map(code=>{
              const a1=t1.find(a=>a.code===code)||{dr:0,cr:0};
              const a2=t2.find(a=>a.code===code)||{dr:0,cr:0};
              return{name:(coa.find(a=>a.code===code)?.name||code).slice(0,14),[cmpP1]:a1.dr+a1.cr,[cmpP2]:a2.dr+a2.cr};
            });
            return(
              <InsightPanel title="Top Accounts by Activity — Period Comparison">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} margin={{top:0,right:16,left:0,bottom:30}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                    <XAxis dataKey="name" tick={{fill:P.muted,fontSize:9}} angle={-20} textAnchor="end" interval={0}/>
                    <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                    <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                    <Legend formatter={v=><span style={{color:P.muted,fontSize:10}}>{v}</span>}/>
                    <Bar dataKey={cmpP1} fill={`${P.blue}80`} radius={[3,3,0,0]}/>
                    <Bar dataKey={cmpP2} fill={P.gold} radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </InsightPanel>
            );
          })()}

          {/* IC vs External split */}
          {(()=>{
            const getSplit=(period)=>{
              const j=gl.filter(x=>gf.entityIds.includes(x.entityId)&&x.period===period);
              const ic=j.filter(x=>x.icEntityId);
              const ext=j.filter(x=>!x.icEntityId);
              const rate=(j2)=>getFxRate(fxRates,period,entities.find(e=>e.id===j2.entityId)?.currency||BASE);
              return{ic:ic.reduce((s,j2)=>s+j2.amount*rate(j2),0),ext:ext.reduce((s,j2)=>s+j2.amount*rate(j2),0)};
            };
            const s1=getSplit(cmpP1),s2=getSplit(cmpP2);
            const pieData1=[{name:"External",value:s1.ext,color:P.blue},{name:"Intercompany",value:s1.ic,color:P.gold}].filter(d=>d.value>0);
            const pieData2=[{name:"External",value:s2.ext,color:P.blue},{name:"Intercompany",value:s2.ic,color:P.gold}].filter(d=>d.value>0);
            return(
              <InsightPanel title="IC vs External Journal Split">
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                  {[[cmpP1,pieData1,s1],[cmpP2,pieData2,s2]].map(([period,data,totals])=>(
                    <div key={period}>
                      <div style={{color:P.muted,fontSize:10,textAlign:"center",marginBottom:6}}>{period}</div>
                      <ResponsiveContainer width="100%" height={150}>
                        <PieChart><Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={60} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                          {data.map((d,i)=><Cell key={i} fill={d.color}/>)}
                        </Pie><Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/></PieChart>
                      </ResponsiveContainer>
                      <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:4}}>
                        <span style={{fontSize:10,color:P.muted}}>IC: <span style={{color:P.gold}}>{fmtK(totals.ic)}</span></span>
                        <span style={{fontSize:10,color:P.muted}}>Ext: <span style={{color:P.blue}}>{fmtK(totals.ext)}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </InsightPanel>
            );
          })()}
        </div>
      )}

      {tab==="journal"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {/* Add journal */}
          <Card title="Add Journal Entry" accent={P.blue}>
            <div style={{display:"grid",gridTemplateColumns:"100px 100px 1fr 90px 90px 120px 120px 140px auto",gap:8,alignItems:"end"}}>
              <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>DATE</div><Input value={jform.date} onChange={v=>setJform(f=>({...f,date:v}))} type="date" style={{fontSize:11}}/></div>
              <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>REF *</div><Input value={jform.ref} onChange={v=>setJform(f=>({...f,ref:v}))} placeholder="SLS-001"/></div>
              <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>DESCRIPTION *</div><Input value={jform.description} onChange={v=>setJform(f=>({...f,description:v}))} placeholder="Description"/></div>
              <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>DR ACCOUNT *</div><Input value={jform.drAccount} onChange={v=>setJform(f=>({...f,drAccount:v}))} placeholder="1100"/></div>
              <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>CR ACCOUNT *</div><Input value={jform.crAccount} onChange={v=>setJform(f=>({...f,crAccount:v}))} placeholder="4000"/></div>
              <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>AMOUNT *</div><Input value={jform.amount} onChange={v=>setJform(f=>({...f,amount:v}))} type="number" placeholder="0"/></div>
              <div>
                <div style={{color:P.muted,fontSize:9,marginBottom:3}}>IC ENTITY</div>
                <Sel value={jform.icEntityId} onChange={v=>setJform(f=>({...f,icEntityId:v}))} style={{width:"100%",fontSize:11}}>
                  <option value="">None (external)</option>
                  {entities.filter(e=>e.id!==fEntity).map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
                </Sel>
              </div>
              <div style={{paddingTop:16,display:"flex",gap:6}}>
                <Btn onClick={addJournal} small>+ Add</Btn>
              </div>
            </div>
            {jerr&&<div style={{color:P.red,fontSize:11,marginTop:8}}>⚠ {jerr}</div>}
            <div style={{marginTop:8,fontSize:10,color:P.muted}}>COA quick ref: {coa.slice(0,6).map(a=><span key={a.code} style={{marginRight:8,color:P.sub}}>{a.code} {a.name}</span>)}</div>
          </Card>

          {/* Journal table */}
          <Card noPad>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:P.surf2}}>
                  {["Date","Ref","Description","Dr Account","Cr Account","Ccy","Amount","IC Entity",""].map(h=>(
                    <th key={h} style={{textAlign:"left",padding:"7px 10px",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {journals.length===0&&<tr><td colSpan={9} style={{padding:20,textAlign:"center",color:P.muted,fontSize:12}}>No journal entries for this entity / period</td></tr>}
                  {journals.map((j,i)=>{
                    const icE=entities.find(e=>e.id===j.icEntityId);
                    return(
                      <tr key={j.id} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}12`}}>
                        <td style={{padding:"6px 10px",fontFamily:"monospace",color:P.muted,fontSize:10}}>{j.date}</td>
                        <td style={{padding:"6px 10px",fontFamily:"monospace",color:P.gold,fontSize:10,fontWeight:700}}>{j.ref}</td>
                        <td style={{padding:"6px 10px",color:P.text,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.description}</td>
                        <td style={{padding:"6px 10px"}}>
                          <div style={{fontFamily:"monospace",color:P.blue,fontSize:11,fontWeight:700}}>{j.drAccount}</div>
                          <div style={{color:P.muted,fontSize:9}}>{acctName(j.drAccount)}</div>
                        </td>
                        <td style={{padding:"6px 10px"}}>
                          <div style={{fontFamily:"monospace",color:P.mag,fontSize:11,fontWeight:700}}>{j.crAccount}</div>
                          <div style={{color:P.muted,fontSize:9}}>{acctName(j.crAccount)}</div>
                        </td>
                        <td style={{padding:"6px 10px",color:P.gold,fontSize:10,fontWeight:600}}>{j.currency}</td>
                        <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.text}}>{fmtAmt(j.amount,j.currency)}</td>
                        <td style={{padding:"6px 10px"}}>
                          {icE?<div style={{display:"flex",alignItems:"center",gap:5}}><EntityDot entity={icE} size={6}/><span style={{color:icE.color,fontSize:10}}>{icE.name}</span></div>:<span style={{color:P.muted,fontSize:10}}>—</span>}
                        </td>
                        <td style={{padding:"6px 10px"}}><Btn onClick={()=>removeJournal(j.id)} small outline danger>✕</Btn></td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{background:P.surf2,borderTop:`1px solid ${P.border}`}}>
                    <td colSpan={6} style={{padding:"7px 10px",color:P.muted,fontSize:10}}>TOTAL — {journals.length} entries</td>
                    <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:P.gold,fontWeight:700}}>{entity?fmtAmt(journals.reduce((s,j)=>s+j.amount,0),entity.currency||"MYR"):"—"}</td>
                    <td colSpan={2}/>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>
      )}

      {tab==="tb"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10}}>
            <KPI label="Total Debits" value={entity?fmtAmt(tbDr,entity.currency||"MYR"):"—"} color={P.blue} accent={P.blue} small/>
            <KPI label="Total Credits" value={entity?fmtAmt(tbCr,entity.currency||"MYR"):"—"} color={P.mag} accent={P.mag} small/>
            <KPI label="MYR Dr Total" value={fmtMYR(tb.reduce((s,r)=>s+(r.debit||0)*r.rate,0))} color={P.gold} small/>
            <KPI label="Balanced" value={balanced?"✓ Yes":"✗ No"} color={balanced?P.green:P.red} small/>
          </div>
          <Card noPad title="Trial Balance — Account Level">
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:P.surf2}}>
                  {["Code","Account","Class","Group","Dr","Cr","Net (local)","FX Method","Rate","Net (MYR)"].map(h=>(
                    <th key={h} style={{textAlign:["Dr","Cr","Net (local)","Rate","Net (MYR)"].includes(h)?"right":"left",padding:"7px 10px",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {IFRS_CLASSES.map(cl=>{
                    const rows=tb.filter(r=>r.class===cl.id);
                    if(!rows.length) return null;
                    const clr=cl.id==="A"?P.blue:cl.id==="L"?P.orange:cl.id==="E"?P.purple:cl.id==="R"?P.green:P.red;
                    const subTotMYR=rows.reduce((s,r)=>s+r.netMYR,0);
                    return[
                      <tr key={`hdr-${cl.id}`}><td colSpan={10} style={{padding:"8px 10px",background:P.surf2,color:clr,fontSize:10,fontWeight:700,letterSpacing:1}}>{cl.label.toUpperCase()} — {cl.fsLine}</td></tr>,
                      ...rows.map((r,i)=>(
                        <tr key={r.code} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}10`}}>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",color:P.gold,fontWeight:700,fontSize:11}}>{r.code}</td>
                          <td style={{padding:"6px 10px",color:P.text}}>{r.accountName}</td>
                          <td style={{padding:"6px 10px"}}><Badge label={r.class} color={clr}/></td>
                          <td style={{padding:"6px 10px",color:P.muted,fontSize:10}}>{r.group}</td>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.blue}}>{r.debit?fmtAmt(r.debit,entity?.currency||"MYR"):"—"}</td>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.mag}}>{r.credit?fmtAmt(r.credit,entity?.currency||"MYR"):"—"}</td>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:r.net>=0?P.text:P.orange}}>{entity?fmtAmt(r.net,entity.currency||"MYR"):"—"}</td>
                          <td style={{padding:"6px 10px"}}><Badge label={r.fxMethod} color={P.gold}/></td>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.muted,fontSize:10}}>{r.rate?.toFixed(4)}</td>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.gold,fontWeight:700}}>{fmtMYR(r.netMYR)}</td>
                        </tr>
                      )),
                      <tr key={`sub-${cl.id}`} style={{background:P.surf2}}>
                        <td colSpan={9} style={{padding:"6px 10px",color:clr,fontSize:10,fontWeight:700}}>Subtotal {cl.label}</td>
                        <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:clr,fontWeight:700}}>{fmtMYR(subTotMYR)}</td>
                      </tr>
                    ];
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {tab==="upload"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card title="Upload Journal Entries">
            <DropZone onRows={handleUpload} label="Drop GL journal file"/>
            <div style={{marginTop:8,fontSize:10,color:P.muted}}>Required: <span style={{color:P.gold}}>EntityId, Period, Date, Ref, Description, DrAccount, CrAccount, Currency, Amount</span> · Optional: ICEntityId</div>
            <button onClick={dlTemplate} style={{marginTop:8,background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,color:P.muted,fontSize:10,padding:"4px 10px",cursor:"pointer",fontFamily:"inherit"}}>↓ GL Template CSV</button>
          </Card>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MODULE: IC TRANSACTIONS
// ══════════════════════════════════════════════════════════════════
function ICModule({gf}){
  const {store,setStore}=useStore();
  const {gl,coa,entities,fxRates}=store;
  const [tab,setTab]=useState("matching");
  const [fPeriod,setFPeriod]=useState(gf.periodTo||fxRates[fxRates.length-1]?.period||"");

  const periods=fxRates.map(r=>r.period);

  // Find all IC journal entries for the period
  const icJournals=gl.filter(j=>j.icEntityId&&j.period===fPeriod&&gf.entityIds.includes(j.entityId));

  // Build IC pairs: group by entity pair + account
  const pairs=useMemo(()=>{
    const map={};
    icJournals.forEach(j=>{
      const e1=j.entityId,e2=j.icEntityId;
      const key=[e1,e2].sort().join("↔");
      if(!map[key]) map[key]={key,entity1Id:e1,entity2Id:e2,entries:[]};
      map[key].entries.push(j);
    });
    return Object.values(map).map(pair=>{
      const e1=entities.find(e=>e.id===pair.entity1Id);
      const e2=entities.find(e=>e.id===pair.entity2Id);
      // Convert both sides to MYR for matching
      const e1Total=pair.entries.filter(j=>j.entityId===pair.entity1Id).reduce((s,j)=>s+j.amount*getFxRate(fxRates,fPeriod,j.currency),0);
      const e2Total=pair.entries.filter(j=>j.entityId===pair.entity2Id).reduce((s,j)=>s+j.amount*getFxRate(fxRates,fPeriod,j.currency),0);
      const diff=Math.abs(e1Total-e2Total);
      const matched=diff<1; // within RM 1 tolerance
      return {...pair,e1,e2,e1Total,e2Total,diff,matched};
    });
  },[icJournals,entities,fxRates,fPeriod,gf.entityIds]);

  // Generate elimination journals
  const eliminations=useMemo(()=>{
    const elims=[];
    pairs.filter(p=>p.matched).forEach(pair=>{
      pair.entries.forEach(j=>{
        const acct=coa.find(a=>a.code===j.drAccount);
        if(acct?.icEligible){
          elims.push({
            id:"EL"+uid(),
            description:`Eliminate IC: ${pair.e1?.name||pair.entity1Id} ↔ ${pair.e2?.name||pair.entity2Id}`,
            drAccount:j.crAccount, // reverse
            crAccount:j.drAccount,
            currency:"MYR",
            amount:j.amount*getFxRate(fxRates,fPeriod,j.currency),
            entityIds:[pair.entity1Id,pair.entity2Id],
            sourceJournal:j.id,
          });
        }
      });
    });
    return elims;
  },[pairs,coa,fxRates,fPeriod]);

  // Group consolidated TB — by account, sum all entities, subtract eliminations
  const groupTB=useMemo(()=>{
    const accMap={};
    // Sum each entity
    gf.entityIds.forEach(eid=>{
      const eTB=computeTrialBalance(gl,coa,fxRates,eid,fPeriod);
      eTB.forEach(row=>{
        if(!accMap[row.code]) accMap[row.code]={code:row.code,name:row.accountName,class:row.class,group:row.group,netMYR:0,isIC:coa.find(a=>a.code===row.code)?.icEligible||false};
        accMap[row.code].netMYR+=row.netMYR;
      });
    });
    // Apply eliminations
    eliminations.forEach(el=>{
      const drAcc=coa.find(a=>a.code===el.drAccount);
      const crAcc=coa.find(a=>a.code===el.crAccount);
      if(drAcc&&accMap[el.drAccount]) accMap[el.drAccount].netMYR+=el.amount;
      if(crAcc&&accMap[el.crAccount]) accMap[el.crAccount].netMYR-=el.amount;
    });
    return Object.values(accMap).sort((a,b)=>a.code.localeCompare(b.code));
  },[gl,coa,fxRates,gf.entityIds,fPeriod,eliminations]);

  // P&L from group TB
  const revenue=groupTB.filter(r=>r.class==="R").reduce((s,r)=>s-r.netMYR,0);
  const expenses=groupTB.filter(r=>r.class==="X").reduce((s,r)=>s+r.netMYR,0);
  const netProfit=revenue-expenses;
  const totalAssets=groupTB.filter(r=>r.class==="A").reduce((s,r)=>s+r.netMYR,0);
  const totalLiab=groupTB.filter(r=>r.class==="L").reduce((s,r)=>s-r.netMYR,0);
  const totalEquity=groupTB.filter(r=>r.class==="E").reduce((s,r)=>s-r.netMYR,0);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Period selector */}
      <div style={{display:"flex",gap:10,alignItems:"center",background:P.surf2,borderRadius:10,padding:"10px 14px",border:`1px solid ${P.border}`}}>
        <span style={{color:P.muted,fontSize:11}}>Consolidation Period</span>
        <Sel value={fPeriod} onChange={setFPeriod} style={{width:140}}>{periods.map(p=><option key={p}>{p}</option>)}</Sel>
        <div style={{marginLeft:"auto",display:"flex",gap:12,fontSize:11}}>
          <span style={{color:P.muted}}>IC pairs: <span style={{color:P.gold,fontWeight:700}}>{pairs.length}</span></span>
          <span style={{color:P.muted}}>Matched: <span style={{color:P.green,fontWeight:700}}>{pairs.filter(p=>p.matched).length}</span></span>
          <span style={{color:P.muted}}>Mismatches: <span style={{color:P.red,fontWeight:700}}>{pairs.filter(p=>!p.matched).length}</span></span>
          <span style={{color:P.muted}}>Eliminations: <span style={{color:P.blue,fontWeight:700}}>{eliminations.length}</span></span>
        </div>
      </div>

      <SubTabs tabs={[{id:"matching",label:"IC Matching"},{id:"eliminations",label:"Eliminations"},{id:"grouppl",label:"Group P&L"},{id:"groupbs",label:"Group BS"},{id:"insights",label:"📊 Insights"}]} active={tab} onChange={setTab}/>

      {tab==="insights"&&<ICInsights gf={gf} gl={gl} coa={coa} entities={entities} fxRates={fxRates} fPeriod={fPeriod} periods={periods}/>}

      {tab==="matching"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {pairs.length===0&&<div style={{color:P.muted,fontSize:12,padding:"20px",textAlign:"center",background:P.surf2,borderRadius:10}}>No intercompany transactions found for this period. Tag journal entries with an IC Entity to see matches here.</div>}
          {pairs.map(pair=>(
            <Card key={pair.key} accent={pair.matched?P.green:P.red}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <EntityDot entity={pair.e1} size={9}/><span style={{color:pair.e1?.color||P.muted,fontWeight:700,fontSize:13}}>{pair.e1?.name||pair.entity1Id}</span>
                </div>
                <span style={{color:P.muted,fontSize:16}}>↔</span>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <EntityDot entity={pair.e2} size={9}/><span style={{color:pair.e2?.color||P.muted,fontWeight:700,fontSize:13}}>{pair.e2?.name||pair.entity2Id}</span>
                </div>
                <div style={{marginLeft:"auto",display:"flex",gap:10,alignItems:"center"}}>
                  {pair.matched
                    ?<Badge label="✓ Matched" color={P.green}/>
                    :<Badge label={`✗ Mismatch — RM ${pair.diff.toFixed(0)} diff`} color={P.red}/>}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <div style={{color:P.muted,fontSize:10,marginBottom:6}}>{pair.e1?.name} entries</div>
                  {pair.entries.filter(j=>j.entityId===pair.entity1Id).map(j=>(
                    <div key={j.id} style={{display:"flex",gap:8,fontSize:11,padding:"5px 0",borderBottom:`1px solid ${P.border}20`}}>
                      <span style={{color:P.muted,fontFamily:"monospace",fontSize:10}}>{j.ref}</span>
                      <span style={{color:P.text,flex:1}}>{j.description}</span>
                      <span style={{color:P.blue,fontFamily:"monospace"}}>Dr {j.drAccount}</span>
                      <span style={{color:P.mag,fontFamily:"monospace"}}>Cr {j.crAccount}</span>
                      <span style={{color:P.gold,fontFamily:"monospace"}}>{fmtAmt(j.amount,j.currency)}</span>
                    </div>
                  ))}
                  <div style={{textAlign:"right",marginTop:6,fontFamily:"monospace",color:P.gold,fontWeight:700}}>{fmtMYR(pair.e1Total)}</div>
                </div>
                <div>
                  <div style={{color:P.muted,fontSize:10,marginBottom:6}}>{pair.e2?.name} entries</div>
                  {pair.entries.filter(j=>j.entityId===pair.entity2Id).map(j=>(
                    <div key={j.id} style={{display:"flex",gap:8,fontSize:11,padding:"5px 0",borderBottom:`1px solid ${P.border}20`}}>
                      <span style={{color:P.muted,fontFamily:"monospace",fontSize:10}}>{j.ref}</span>
                      <span style={{color:P.text,flex:1}}>{j.description}</span>
                      <span style={{color:P.blue,fontFamily:"monospace"}}>Dr {j.drAccount}</span>
                      <span style={{color:P.mag,fontFamily:"monospace"}}>Cr {j.crAccount}</span>
                      <span style={{color:P.gold,fontFamily:"monospace"}}>{fmtAmt(j.amount,j.currency)}</span>
                    </div>
                  ))}
                  {pair.entries.filter(j=>j.entityId===pair.entity2Id).length===0&&<div style={{color:P.red,fontSize:11,padding:"8px 0"}}>⚠ No corresponding entry found in {pair.e2?.name}</div>}
                  <div style={{textAlign:"right",marginTop:6,fontFamily:"monospace",color:pair.matched?P.gold:P.red,fontWeight:700}}>{fmtMYR(pair.e2Total)}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab==="eliminations"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{fontSize:11,color:P.muted,background:P.surf2,borderRadius:8,padding:"10px 14px"}}>
            Elimination entries are auto-generated for all <strong style={{color:P.gold}}>matched IC pairs</strong> on accounts marked as <strong style={{color:P.gold}}>IC Eligible</strong> in the COA. These reverse the IC leg to arrive at Group figures.
          </div>
          {eliminations.length===0&&<div style={{color:P.muted,fontSize:12,padding:"20px",textAlign:"center",background:P.surf2,borderRadius:10}}>No eliminations generated — ensure IC pairs are matched and accounts are marked IC Eligible in COA.</div>}
          <Card noPad>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:P.surf2}}>
                  {["Description","Dr Account","Cr Account","Amount (MYR)","Entities"].map(h=>(
                    <th key={h} style={{textAlign:"left",padding:"8px 10px",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {eliminations.map((el,i)=>(
                    <tr key={el.id} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}12`}}>
                      <td style={{padding:"7px 10px",color:P.text}}>{el.description}</td>
                      <td style={{padding:"7px 10px"}}><span style={{fontFamily:"monospace",color:P.blue,fontWeight:700}}>{el.drAccount}</span><div style={{color:P.muted,fontSize:9}}>{coa.find(a=>a.code===el.drAccount)?.name}</div></td>
                      <td style={{padding:"7px 10px"}}><span style={{fontFamily:"monospace",color:P.mag,fontWeight:700}}>{el.crAccount}</span><div style={{color:P.muted,fontSize:9}}>{coa.find(a=>a.code===el.crAccount)?.name}</div></td>
                      <td style={{padding:"7px 10px",fontFamily:"monospace",color:P.gold,fontWeight:700,textAlign:"right"}}>{fmtMYR(el.amount)}</td>
                      <td style={{padding:"7px 10px"}}>
                        <div style={{display:"flex",gap:6}}>
                          {el.entityIds.map(eid=>{const e=entities.find(x=>x.id===eid);return e?<div key={eid} style={{display:"flex",alignItems:"center",gap:4}}><EntityDot entity={e} size={6}/><span style={{color:e.color,fontSize:10}}>{e.name}</span></div>:null;})}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {eliminations.length>0&&<tfoot>
                  <tr style={{background:P.surf2,borderTop:`1px solid ${P.border}`}}>
                    <td colSpan={3} style={{padding:"7px 10px",color:P.muted,fontSize:10}}>TOTAL ELIMINATIONS</td>
                    <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:P.gold,fontWeight:700}}>{fmtMYR(eliminations.reduce((s,e)=>s+e.amount,0))}</td>
                    <td/>
                  </tr>
                </tfoot>}
              </table>
            </div>
          </Card>
        </div>
      )}

      {tab==="grouppl"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            <KPI label="Group Revenue" value={fmtK(revenue)} color={P.green} accent={P.green} small/>
            <KPI label="Group Expenses" value={fmtK(expenses)} color={P.red} accent={P.red} small/>
            <KPI label="Net Profit / (Loss)" value={fmtK(netProfit)} color={netProfit>=0?P.green:P.red} small sub={`${fPeriod} · post-elimination`}/>
          </div>
          <Card noPad title="Group Consolidated P&L — MYR (post IC elimination)">
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:P.surf2}}>
                  {["Code","Account","Group","Net MYR","% of Revenue"].map(h=>(
                    <th key={h} style={{textAlign:["Net MYR","% of Revenue"].includes(h)?"right":"left",padding:"7px 10px",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {["R","X"].map(cls=>{
                    const cl=IFRS_CLASSES.find(c=>c.id===cls);
                    const rows=groupTB.filter(r=>r.class===cls);
                    const subTot=rows.reduce((s,r)=>s+(cls==="R"?-r.netMYR:r.netMYR),0);
                    const clr=cls==="R"?P.green:P.red;
                    return[
                      <tr key={`h${cls}`}><td colSpan={5} style={{padding:"8px 10px",background:P.surf2,color:clr,fontSize:10,fontWeight:700,letterSpacing:1}}>{cl?.label.toUpperCase()}</td></tr>,
                      ...rows.map((r,i)=>{
                        const val=cls==="R"?-r.netMYR:r.netMYR;
                        return(
                          <tr key={r.code} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}10`,opacity:r.isIC?0.7:1}}>
                            <td style={{padding:"6px 10px",fontFamily:"monospace",color:P.gold,fontSize:11}}>{r.code}</td>
                            <td style={{padding:"6px 10px",color:P.text}}>{r.name}{r.isIC&&<span style={{color:P.muted,fontSize:9,marginLeft:6}}>(IC — eliminated)</span>}</td>
                            <td style={{padding:"6px 10px",color:P.muted,fontSize:10}}>{r.group}</td>
                            <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:val>=0?P.text:P.orange}}>{fmtMYR(val)}</td>
                            <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.muted,fontSize:10}}>{revenue>0?`${((val/revenue)*100).toFixed(1)}%`:"—"}</td>
                          </tr>
                        );
                      }),
                      <tr key={`s${cls}`} style={{background:P.surf2}}><td colSpan={3} style={{padding:"6px 10px",color:clr,fontSize:10,fontWeight:700}}>Total {cl?.label}</td><td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:clr,fontWeight:700}}>{fmtMYR(subTot)}</td><td/></tr>,
                    ];
                  })}
                  <tr style={{borderTop:`2px solid ${P.gold}`,background:P.surf3}}>
                    <td colSpan={3} style={{padding:"10px",color:P.gold,fontWeight:700,fontSize:12}}>NET PROFIT / (LOSS)</td>
                    <td style={{padding:"10px",fontFamily:"monospace",textAlign:"right",color:netProfit>=0?P.green:P.red,fontWeight:700,fontSize:13}}>{fmtMYR(netProfit)}</td>
                    <td style={{padding:"10px",fontFamily:"monospace",textAlign:"right",color:P.muted,fontSize:11}}>{revenue>0?`${((netProfit/revenue)*100).toFixed(1)}%`:"—"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {tab==="groupbs"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            <KPI label="Total Assets" value={fmtK(totalAssets)} color={P.blue}   accent={P.blue}   small/>
            <KPI label="Total Liabilities" value={fmtK(totalLiab)} color={P.orange} accent={P.orange} small/>
            <KPI label="Total Equity" value={fmtK(totalEquity+netProfit)} color={P.purple} accent={P.purple} small sub="incl. current period profit"/>
          </div>
          <Card noPad title="Group Consolidated Balance Sheet — MYR (post IC elimination)">
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:P.surf2}}>
                  {["Code","Account","Group","Net MYR"].map(h=>(
                    <th key={h} style={{textAlign:h==="Net MYR"?"right":"left",padding:"7px 10px",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {["A","L","E"].map(cls=>{
                    const cl=IFRS_CLASSES.find(c=>c.id===cls);
                    const rows=groupTB.filter(r=>r.class===cls);
                    const sign=cls==="A"?1:-1;
                    const subTot=rows.reduce((s,r)=>s+sign*r.netMYR,0);
                    const clr=cls==="A"?P.blue:cls==="L"?P.orange:P.purple;
                    return[
                      <tr key={`h${cls}`}><td colSpan={4} style={{padding:"8px 10px",background:P.surf2,color:clr,fontSize:10,fontWeight:700,letterSpacing:1}}>{cl?.label.toUpperCase()} — {cl?.fsLine}</td></tr>,
                      ...rows.map((r,i)=>{
                        const val=sign*r.netMYR;
                        return(
                          <tr key={r.code} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}10`,opacity:r.isIC?0.6:1}}>
                            <td style={{padding:"6px 10px",fontFamily:"monospace",color:P.gold,fontSize:11}}>{r.code}</td>
                            <td style={{padding:"6px 10px",color:P.text}}>{r.name}{r.isIC&&<span style={{color:P.muted,fontSize:9,marginLeft:6}}>(IC — eliminated)</span>}</td>
                            <td style={{padding:"6px 10px",color:P.muted,fontSize:10}}>{r.group}</td>
                            <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:val>=0?P.text:P.orange}}>{fmtMYR(val)}</td>
                          </tr>
                        );
                      }),
                      <tr key={`s${cls}`} style={{background:P.surf2}}><td colSpan={3} style={{padding:"6px 10px",color:clr,fontSize:10,fontWeight:700}}>Total {cl?.label}</td><td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:clr,fontWeight:700}}>{fmtMYR(subTot)}</td></tr>,
                    ];
                  })}
                  <tr style={{borderTop:`2px solid ${P.gold}`,background:P.surf3}}>
                    <td colSpan={3} style={{padding:"10px",color:P.gold,fontWeight:700,fontSize:12}}>TOTAL LIABILITIES + EQUITY</td>
                    <td style={{padding:"10px",fontFamily:"monospace",textAlign:"right",color:Math.abs(totalAssets-totalLiab-totalEquity-netProfit)<1?P.green:P.red,fontWeight:700,fontSize:13}}>{fmtMYR(totalLiab+totalEquity+netProfit)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// AR/AP MODULE (condensed — links to shared store)
// ══════════════════════════════════════════════════════════════════
function ARAPModule({gf}){
  const {store}=useStore();
  const {entities,fxRates,ar,ap}=store;
  const [tab,setTab]=useState("ledger");
  const [mode,setMode]=useState("AR");
  const [fStatus,setFStatus]=useState("All");

  const periods=fxRates.map(r=>r.period);
  const lastTwo=periods.slice(-2);
  const [cP1,setCP1]=useState(lastTwo[0]||periods[0]||"");
  const [cP2,setCP2]=useState(lastTwo[1]||periods[0]||"");

  const spotRow=fxRates[fxRates.length-1]||{};
  const toRM=(amt,ccy,row)=>{const fx=row||spotRow;if(ccy===BASE)return amt;if(ccy==="USD")return amt*(fx.MYR||1);const r=fx[ccy];const m=fx.MYR;return(r&&m)?amt*(m/r):amt;};

  const filtAR=ar.filter(r=>gf.entityIds.includes(r.entityId));
  const filtAP=ap.filter(r=>gf.entityIds.includes(r.entityId));
  const records=mode==="AR"?filtAR:filtAP;
  const filtRecords=fStatus==="All"?records:records.filter(r=>r.status===fStatus);

  const arTot=filtAR.filter(r=>r.status!=="Paid").reduce((s,r)=>s+toRM(r.amount,r.currency),0);
  const apTot=filtAP.filter(r=>r.status!=="Paid").reduce((s,r)=>s+toRM(r.amount,r.currency),0);
  const arOvd=filtAR.filter(r=>r.status==="Overdue");

  // Ageing buckets
  const enriched=filtRecords.map(r=>({...r,dpd:Math.floor((TODAY-new Date(r.dueDate))/86400000),rm:toRM(r.amount,r.currency)}));
  const bucketTotals=BUCKET_DEF.map((b,i)=>{
    const rows=enriched.filter(r=>r.status!=="Paid"&&(b==="Current"?r.dpd<=0:b==="1–30"?r.dpd>0&&r.dpd<=30:b==="31–60"?r.dpd>0&&r.dpd<=60:b==="61–90"?r.dpd>0&&r.dpd<=90:b==="91–120"?r.dpd>0&&r.dpd<=120:r.dpd>120));
    return {bucket:b,total:rows.reduce((s,r)=>s+r.rm,0),count:rows.length,color:BUCKET_CLR[i]};
  });
  const grandBucket=bucketTotals.reduce((s,b)=>s+b.total,0);

  // Period comparison — outstanding by invoice month
  // Period comparison — outstanding by invoice month
  function periodToISO(period){
    const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const parts=period.split(" ");
    if(parts.length!==2) return "";
    const mo=String(months.indexOf(parts[0])+1).padStart(2,"0");
    return parts[1]+"-"+mo;
  }
  function periodTotal(recs,period){
    const fxRow=fxRates.find(r=>r.period===period)||spotRow;
    const prefix=periodToISO(period);
    return recs.filter(r=>prefix&&r.invoiceDate?.startsWith(prefix))
      .reduce((s,r)=>s+toRM(r.amount,r.currency,fxRow),0);
  }
  // Status breakdown
  const statusData=STATUS_LIST.map(s=>({
    status:s,
    ar:filtAR.filter(r=>r.status===s).reduce((sum,r)=>sum+toRM(r.amount,r.currency),0),
    ap:filtAP.filter(r=>r.status===s).reduce((sum,r)=>sum+toRM(r.amount,r.currency),0),
  }));

  // Top counterparties by outstanding
  const cpMap={};
  filtAR.filter(r=>r.status!=="Paid").forEach(r=>{
    if(!cpMap[r.counterparty])cpMap[r.counterparty]={name:r.counterparty,total:0,count:0};
    cpMap[r.counterparty].total+=toRM(r.amount,r.currency);cpMap[r.counterparty].count++;
  });
  const topCP=Object.values(cpMap).sort((a,b)=>b.total-a.total).slice(0,6);

  // Entity breakdown
  const entityBreakdown=entities.filter(e=>gf.entityIds.includes(e.id)).map(e=>({
    name:e.name,color:e.color,
    ar:filtAR.filter(r=>r.entityId===e.id&&r.status!=="Paid").reduce((s,r)=>s+toRM(r.amount,r.currency),0),
    ap:filtAP.filter(r=>r.entityId===e.id&&r.status!=="Paid").reduce((s,r)=>s+toRM(r.amount,r.currency),0),
  }));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Header controls */}
      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:3,background:P.surf2,borderRadius:8,padding:3,border:`1px solid ${P.border}`}}>
          {["AR","AP","Both"].map(m=><button key={m} onClick={()=>setMode(m)} style={{padding:"5px 13px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:600,background:mode===m?(m==="AR"?P.green:m==="AP"?P.mag:P.gold):"transparent",color:mode===m?"#0B0F1A":P.muted,transition:"all 0.15s"}}>{m}</button>)}
        </div>
        <Sel value={fStatus} onChange={setFStatus} style={{width:130,fontSize:11}}>
          <option value="All">All Statuses</option>{STATUS_LIST.map(s=><option key={s}>{s}</option>)}
        </Sel>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        <KPI label="AR Outstanding" value={fmtK(arTot)} color={P.green}  accent={P.green}  small sub={`${filtAR.filter(r=>r.status!=="Paid").length} invoices`}/>
        <KPI label="AP Outstanding" value={fmtK(apTot)} color={P.mag}    accent={P.mag}    small sub={`${filtAP.filter(r=>r.status!=="Paid").length} bills`}/>
        <KPI label="Net Exposure"   value={fmtK(arTot-apTot)} color={arTot>apTot?P.green:P.red} small sub="AR – AP"/>
        <KPI label="AR Overdue"     value={fmtK(arOvd.reduce((s,r)=>s+toRM(r.amount,r.currency),0))} color={P.red} accent={P.red} small sub={`${arOvd.length} invoices`}/>
      </div>

      <SubTabs tabs={[{id:"ledger",label:"Ledger"},{id:"ageing",label:"Ageing"},{id:"insights",label:"📊 Insights"}]} active={tab} onChange={setTab}/>

      {tab==="ledger"&&(
        <Card noPad>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:P.surf2}}>{["Entity","Counterparty","Invoice Date","Due Date","Currency","Amount","RM Equiv.","Status"].map(h=><th key={h} style={{textAlign:"left",padding:"7px 10px",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10}}>{h}</th>)}</tr></thead>
              <tbody>{filtRecords.map((r,i)=>{const e=entities.find(x=>x.id===r.entityId);return(
                <tr key={r.id} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}12`,opacity:r.status==="Paid"?0.5:1}}>
                  <td style={{padding:"6px 10px"}}><div style={{display:"flex",alignItems:"center",gap:5}}><EntityDot entity={e} size={6}/><span style={{color:e?.color||P.muted,fontSize:10,fontWeight:600}}>{e?.name||"—"}</span></div></td>
                  <td style={{padding:"6px 10px",color:P.text}}>{r.counterparty}</td>
                  <td style={{padding:"6px 10px",fontFamily:"monospace",color:P.muted,fontSize:10}}>{r.invoiceDate}</td>
                  <td style={{padding:"6px 10px",fontFamily:"monospace",color:P.muted,fontSize:10}}>{r.dueDate}</td>
                  <td style={{padding:"6px 10px",color:P.gold,fontSize:10,fontWeight:600}}>{r.currency}</td>
                  <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.text}}>{fmtAmt(r.amount,r.currency)}</td>
                  <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.gold,fontWeight:700}}>{fmtMYR(toRM(r.amount,r.currency))}</td>
                  <td style={{padding:"6px 10px"}}><Badge label={r.status} color={STATUS_CLR[r.status]||P.muted}/></td>
                </tr>
              );})}
              {!filtRecords.length&&<tr><td colSpan={8} style={{padding:20,textAlign:"center",color:P.muted,fontSize:12}}>No records</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab==="ageing"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card title={`Ageing Buckets — ${mode} (excl. Paid) · RM`}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:8,marginBottom:12}}>
              {bucketTotals.map(b=>(
                <div key={b.bucket} style={{background:`${b.color}12`,border:`1px solid ${b.color}40`,borderRadius:9,padding:"9px 11px"}}>
                  <div style={{color:b.color,fontSize:9,fontWeight:700,letterSpacing:1,marginBottom:3}}>{b.bucket==="Current"?"CURRENT":`${b.bucket}D`}</div>
                  <div style={{color:P.text,fontSize:14,fontWeight:700,fontFamily:"monospace"}}>{fmtK(b.total)}</div>
                  <div style={{color:P.muted,fontSize:9,marginTop:2}}>{b.count} rec.</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",height:6,borderRadius:3,overflow:"hidden",gap:1}}>
              {bucketTotals.filter(b=>b.total>0).map(b=><div key={b.bucket} style={{flex:b.total/(grandBucket||1),background:b.color}}/>)}
            </div>
          </Card>
          <Card title="Ageing Distribution Chart">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={bucketTotals} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="bucket" tick={{fill:P.muted,fontSize:10}}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Bar dataKey="total" name="Outstanding" radius={[4,4,0,0]}>
                  {bucketTotals.map((b,i)=><Cell key={i} fill={b.color}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {tab==="insights"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <PeriodComparePicker periods={periods.length?periods:["Dec 2024"]} p1={cP1} p2={cP2} onP1={setCP1} onP2={setCP2}/>

          <InsightPanel title="AR vs AP by Status — Composition">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="status" tick={{fill:P.muted,fontSize:10}}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Legend formatter={v=><span style={{color:P.muted,fontSize:11}}>{v}</span>}/>
                <Bar dataKey="ar" name="AR" fill={P.green} radius={[3,3,0,0]}/>
                <Bar dataKey="ap" name="AP" fill={P.mag}   radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </InsightPanel>

          <InsightPanel title="AR Outstanding by Entity — Period Comparison">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10,marginBottom:14}}>
              {entityBreakdown.map(e=>(
                <div key={e.name} style={{background:P.surf2,border:`1px solid ${e.color}30`,borderRadius:9,padding:"10px 12px"}}>
                  <div style={{color:e.color,fontSize:10,fontWeight:700,marginBottom:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.name}</div>
                  <div style={{display:"flex",gap:12}}>
                    <div><div style={{color:P.muted,fontSize:9}}>AR</div><div style={{color:P.green,fontFamily:"monospace",fontSize:12,fontWeight:700}}>{fmtK(e.ar)}</div></div>
                    <div><div style={{color:P.muted,fontSize:9}}>AP</div><div style={{color:P.mag,fontFamily:"monospace",fontSize:12,fontWeight:700}}>{fmtK(e.ap)}</div></div>
                    <div><div style={{color:P.muted,fontSize:9}}>NET</div><div style={{color:e.ar>e.ap?P.green:P.red,fontFamily:"monospace",fontSize:12,fontWeight:700}}>{fmtK(e.ar-e.ap)}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </InsightPanel>

          <InsightPanel title="Top AR Counterparties — Outstanding">
            {topCP.map((cp,i)=>(
              <div key={cp.name} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:i<topCP.length-1?`1px solid ${P.border}20`:"none"}}>
                <div style={{width:18,height:18,borderRadius:"50%",background:`${P.green}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:P.green,fontWeight:700}}>{i+1}</div>
                <div style={{flex:1,color:P.text,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cp.name}</div>
                <div style={{fontFamily:"monospace",color:P.gold,fontWeight:700,fontSize:12}}>{fmtMYR(cp.total)}</div>
                <div style={{color:P.muted,fontSize:10}}>{cp.count} inv.</div>
                <div style={{width:80,height:5,background:P.border,borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.min(100,(cp.total/topCP[0].total)*100)}%`,background:P.green,borderRadius:3}}/>
                </div>
              </div>
            ))}
            {!topCP.length&&<div style={{color:P.muted,fontSize:12,padding:"10px 0"}}>No outstanding AR</div>}
          </InsightPanel>

          <InsightPanel title="Currency Mix — Outstanding AR">
            {(()=>{
              const ccyData=CCY_LIST.map(c=>{
                const tot=filtAR.filter(r=>r.status!=="Paid"&&r.currency===c).reduce((s,r)=>s+toRM(r.amount,r.currency),0);
                return {currency:c,total:tot,color:CCY_CLR[c]||P.muted};
              }).filter(c=>c.total>0);
              const tot=ccyData.reduce((s,c)=>s+c.total,0);
              return(
                <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
                  <div style={{flex:"0 0 160px"}}>
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart><Pie data={ccyData} dataKey="total" nameKey="currency" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={2}>
                        {ccyData.map((c,i)=><Cell key={i} fill={c.color}/>)}
                      </Pie><Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/></PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
                    {ccyData.map(c=>(
                      <div key={c.currency} style={{display:"flex",gap:8,alignItems:"center"}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:c.color,flexShrink:0}}/>
                        <span style={{color:P.sub,fontSize:11,width:36}}>{c.currency}</span>
                        <div style={{flex:1,height:4,background:P.border,borderRadius:2,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${tot?(c.total/tot)*100:0}%`,background:c.color,borderRadius:2}}/>
                        </div>
                        <span style={{fontFamily:"monospace",color:P.gold,fontSize:11,fontWeight:700}}>{fmtMYR(c.total)}</span>
                        <span style={{color:P.muted,fontSize:10}}>{tot?((c.total/tot)*100).toFixed(0):0}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </InsightPanel>
        </div>
      )}
    </div>
  );
}

function FXModule({gf}){
  const {store,setStore}=useStore();
  const {fxRates}=store;
  const [tab,setTab]=useState("rates");

  const allPeriods=fxRates.map(r=>r.period);
  const lastTwo=allPeriods.slice(-2);
  const [cP1,setCP1]=useState(lastTwo[0]||allPeriods[0]||"");
  const [cP2,setCP2]=useState(lastTwo[1]||allPeriods[0]||"");
  const [selectedCcys,setSelectedCcys]=useState(["SGD","USD","PHP"]);

  const filtPeriods=useMemo(()=>{
    const from=gf.periodFrom?fxRates.findIndex(r=>r.period===gf.periodFrom):0;
    const to=gf.periodTo?fxRates.findIndex(r=>r.period===gf.periodTo):fxRates.length-1;
    return fxRates.slice(Math.max(0,from),to+1);
  },[fxRates,gf]);

  const rebased=filtPeriods.map(r=>{
    const m=r.MYR;if(!m)return{period:r.period};
    const o={period:r.period};
    o.USD=+(1/m).toFixed(6);
    ["SGD","PHP","IDR","THB","VND"].forEach(c=>{if(r[c])o[c]=+(r[c]/m).toFixed(6);});
    return o;
  });

  const ccys=["SGD","USD","PHP","IDR","THB","VND"];
  const last=rebased[rebased.length-1],prev=rebased[rebased.length-2];

  function toggleCcy(c){setSelectedCcys(s=>s.includes(c)?s.filter(x=>x!==c):[...s,c]);}

  // Compare two periods
  const r1=rebased.find(r=>r.period===cP1)||{};
  const r2=rebased.find(r=>r.period===cP2)||{};

  // Volatility — std dev over filtered window
  function stdDev(ccy){
    const vals=rebased.map(r=>r[ccy]).filter(Boolean);
    if(vals.length<2)return null;
    const avg=vals.reduce((a,b)=>a+b,0)/vals.length;
    return Math.sqrt(vals.reduce((a,b)=>a+(b-avg)**2,0)/vals.length);
  }
  function avgRate(ccy){const vals=rebased.map(r=>r[ccy]).filter(Boolean);return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null;}

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:10}}>
        {["SGD","USD","PHP"].map(c=>(
          <KPI key={c} label={`${c} / MYR`} value={last?.[c]?.toFixed(4)||"—"} color={CCY_CLR[c]} accent={CCY_CLR[c]} small
            sub={last&&prev&&prev[c]?`${pct(prev[c],last[c])>=0?"▲":"▼"}${Math.abs(pct(prev[c],last[c])||0).toFixed(2)}% vs prior`:""}/>
        ))}
      </div>

      <SubTabs tabs={[{id:"rates",label:"Rate Table"},{id:"trend",label:"Trend"},{id:"compare",label:"Period Compare"},{id:"insights",label:"📊 Insights"}]} active={tab} onChange={setTab}/>

      {tab==="rates"&&(
        <Card noPad title={`FX Rates — X per 1 MYR · ${rebased.length} periods`}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:P.surf2}}>
                {["Period",...ccys.slice(0,4)].map(h=><th key={h} style={{textAlign:h==="Period"?"left":"right",padding:"7px 10px",color:h==="Period"?P.muted:CCY_CLR[h]||P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1}}>{h}/MYR</th>)}
              </tr></thead>
              <tbody>{rebased.map((r,i)=>(
                <tr key={r.period} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}12`}}>
                  <td style={{padding:"6px 10px",fontFamily:"monospace",color:P.sub,fontSize:11,fontWeight:600}}>{r.period}</td>
                  {ccys.slice(0,4).map(c=>{
                    const prev2=i>0?rebased[i-1][c]:null;
                    const chg=prev2&&r[c]?pct(prev2,r[c]):null;
                    return(
                      <td key={c} style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right"}}>
                        <span style={{color:P.text,fontSize:11}}>{r[c]?.toFixed(4)||"—"}</span>
                        {chg!=null&&<span style={{fontSize:9,color:chg>=0?P.red:P.green,marginLeft:4}}>{chg>=0?"▲":"▼"}{Math.abs(chg).toFixed(2)}%</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Card>
      )}

      {tab==="trend"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {ccys.map(c=>{const on=selectedCcys.includes(c);return(
              <button key={c} onClick={()=>toggleCcy(c)} style={{padding:"3px 12px",borderRadius:14,border:`1px solid ${on?CCY_CLR[c]:P.border}`,background:on?`${CCY_CLR[c]}20`:"transparent",color:on?CCY_CLR[c]:P.muted,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>{c}</button>
            );})}
          </div>
          <Card title="FX Rate Trend — X per 1 MYR">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={rebased} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="period" tick={{fill:P.muted,fontSize:10}}/>
                <YAxis tick={{fill:P.muted,fontSize:10}}/>
                <Tooltip contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Legend formatter={v=><span style={{color:CCY_CLR[v]||P.muted,fontSize:11}}>{v}/MYR</span>}/>
                {selectedCcys.map(c=><Line key={c} type="monotone" dataKey={c} stroke={CCY_CLR[c]||P.muted} strokeWidth={2} dot={{r:2}} activeDot={{r:4}}/>)}
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Indexed Trend — Base 100 at Start of Window">
            <div style={{fontSize:10,color:P.muted,marginBottom:10}}>Values above 100 mean the foreign currency strengthened vs MYR (MYR weakened).</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={rebased.map((r,i)=>{const o={period:r.period};selectedCcys.forEach(c=>{const first=rebased[0]?.[c];o[c]=first&&r[c]?+(r[c]/first*100).toFixed(2):null;});return o;})} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="period" tick={{fill:P.muted,fontSize:10}}/>
                <YAxis tick={{fill:P.muted,fontSize:10}} domain={["auto","auto"]}/>
                <ReferenceLine y={100} stroke={P.muted} strokeDasharray="4 4"/>
                <Tooltip formatter={v=>`${v?.toFixed(2)} idx`} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                {selectedCcys.map(c=><Line key={c} type="monotone" dataKey={c} stroke={CCY_CLR[c]||P.muted} strokeWidth={2} dot={false}/>)}
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {tab==="compare"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <PeriodComparePicker periods={allPeriods} p1={cP1} p2={cP2} onP1={setCP1} onP2={setCP2}/>
          <Card noPad title={`${cP1} vs ${cP2} — Rate Comparison`}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:P.surf2}}>
                  {["Currency",cP1,cP2,"Abs Δ","% Δ","Signal"].map(h=>(
                    <th key={h} style={{textAlign:"left",padding:"8px 10px",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{ccys.map(c=>{
                  const v1=r1[c],v2=r2[c];const chg=v1&&v2?pct(v1,v2):null;
                  const myrWeakened=chg>0; // higher X/MYR = MYR weakened
                  return(
                    <tr key={c} style={{borderBottom:`1px solid ${P.border}20`}}>
                      <td style={{padding:"8px 10px"}}><span style={{color:CCY_CLR[c]||P.muted,fontWeight:700}}>{c}/MYR</span></td>
                      <td style={{padding:"8px 10px",fontFamily:"monospace",color:P.text}}>{v1?.toFixed(4)||"—"}</td>
                      <td style={{padding:"8px 10px",fontFamily:"monospace",color:P.text}}>{v2?.toFixed(4)||"—"}</td>
                      <td style={{padding:"8px 10px",fontFamily:"monospace",color:chg>0?P.red:P.green,fontWeight:600}}>{v1&&v2?`${chg>0?"+":""}${(v2-v1).toFixed(4)}`:"—"}</td>
                      <td style={{padding:"8px 10px"}}>{chg!=null?<span style={{color:myrWeakened?P.red:P.green,fontWeight:600,fontSize:11}}>{chg>=0?"▲":"▼"}{Math.abs(chg).toFixed(2)}%</span>:"—"}</td>
                      <td style={{padding:"8px 10px",color:P.muted,fontSize:10}}>{chg==null?"—":Math.abs(chg)<0.5?"Stable":myrWeakened?"⚠ MYR weakened":"✓ MYR strengthened"}</td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </Card>
          <Card title="% Change — Period on Period">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ccys.map(c=>({currency:c,change:r1[c]&&r2[c]?pct(r1[c],r2[c]):0,fill:r1[c]&&r2[c]&&pct(r1[c],r2[c])>0?P.red:P.green}))} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="currency" tick={{fill:P.muted,fontSize:11}}/>
                <YAxis tick={{fill:P.muted,fontSize:10}} tickFormatter={v=>`${v.toFixed(1)}%`}/>
                <ReferenceLine y={0} stroke={P.muted}/>
                <Tooltip formatter={v=>`${v?.toFixed(2)}%`} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Bar dataKey="change" name="% Change" radius={[4,4,0,0]}>
                  {ccys.map((c,i)=><Cell key={i} fill={r1[c]&&r2[c]&&pct(r1[c],r2[c])>0?P.red:P.green}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {tab==="insights"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <InsightPanel title="Volatility Summary — Std Dev over Selected Window">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
              {ccys.map(c=>{
                const sd=stdDev(c);const avg=avgRate(c);const cv=sd&&avg?(sd/avg)*100:null;
                const clr=cv==null?"—":cv>2?P.red:cv>0.5?P.gold:P.green;
                return(
                  <div key={c} style={{background:P.surf2,border:`1px solid ${CCY_CLR[c]||P.border}30`,borderRadius:9,padding:"10px 12px"}}>
                    <div style={{color:CCY_CLR[c]||P.muted,fontSize:10,fontWeight:700,marginBottom:4}}>{c}/MYR</div>
                    <div style={{color:P.text,fontFamily:"monospace",fontSize:13,fontWeight:700}}>{avg?.toFixed(4)||"—"}</div>
                    <div style={{color:P.muted,fontSize:9,marginTop:3}}>Avg rate</div>
                    <div style={{marginTop:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{color:P.muted,fontSize:9}}>CV%</span>
                      <span style={{color:clr,fontWeight:700,fontSize:11}}>{cv!=null?cv.toFixed(2)+"%":"—"}</span>
                    </div>
                    <div style={{color:P.muted,fontSize:8,marginTop:2}}>{cv==null?"—":cv>2?"High volatility":cv>0.5?"Moderate":"Stable"}</div>
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:10,fontSize:10,color:P.muted}}>CV = Coefficient of Variation. &gt;2% = high · 0.5–2% = moderate · &lt;0.5% = stable vs MYR</div>
          </InsightPanel>

          <InsightPanel title="Period-on-Period % Change — All Currencies">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={rebased.slice(1).map((r,i)=>{
                const prev2=rebased[i];const o={period:r.period};
                ccys.slice(0,4).forEach(c=>{o[c]=prev2[c]&&r[c]?+(pct(prev2[c],r[c])||0).toFixed(2):null;});
                return o;
              })} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="period" tick={{fill:P.muted,fontSize:10}}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>`${v.toFixed(1)}%`}/>
                <ReferenceLine y={0} stroke={P.muted} strokeDasharray="4 4"/>
                <Tooltip formatter={v=>`${v?.toFixed(2)}%`} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Legend formatter={v=><span style={{color:CCY_CLR[v]||P.muted,fontSize:11}}>{v}</span>}/>
                {ccys.slice(0,4).map(c=><Line key={c} type="monotone" dataKey={c} stroke={CCY_CLR[c]||P.muted} strokeWidth={2} dot={{r:2}}/>)}
              </LineChart>
            </ResponsiveContainer>
          </InsightPanel>

          <InsightPanel title="MYR Strength — Relative Performance vs Basket">
            <div style={{fontSize:10,color:P.muted,marginBottom:8}}>How much each currency moved relative to MYR over the selected window. Red = MYR weakened against that currency.</div>
            {ccys.slice(0,4).map(c=>{
              const first=rebased[0]?.[c],latest=rebased[rebased.length-1]?.[c];
              const totalChg=first&&latest?pct(first,latest):null;
              const clr=totalChg==null?P.muted:totalChg>0?P.red:P.green;
              return(
                <div key={c} style={{display:"flex",gap:10,alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${P.border}20`}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:CCY_CLR[c]||P.muted,flexShrink:0}}/>
                  <span style={{color:P.sub,fontSize:11,width:32,fontWeight:600}}>{c}</span>
                  <div style={{flex:1,height:5,background:P.border,borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${totalChg!=null?Math.min(100,Math.abs(totalChg)*10):0}%`,background:clr,borderRadius:3}}/>
                  </div>
                  <span style={{fontFamily:"monospace",color:clr,fontSize:11,fontWeight:700,width:70,textAlign:"right"}}>{totalChg!=null?`${totalChg>0?"+":""}${totalChg.toFixed(2)}%`:"—"}</span>
                  <span style={{color:P.muted,fontSize:9,width:120}}>{totalChg==null?"—":Math.abs(totalChg)<0.5?"Stable":totalChg>0?"MYR weakened":"MYR strengthened"}</span>
                </div>
              );
            })}
          </InsightPanel>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// OVERVIEW
// ══════════════════════════════════════════════════════════════════
function Overview({store,gf}){
  const {entities,fxRates,ar,ap,gl,coa}=store;
  const spotRow=fxRates[fxRates.length-1]||{};
  const toRM=(amt,ccy)=>{if(ccy===BASE)return amt;if(ccy==="USD")return amt*(spotRow.MYR||1);const r=spotRow[ccy];const m=spotRow.MYR;return(r&&m)?amt*(m/r):amt;};
  const actE=entities.filter(e=>e.active&&gf.entityIds.includes(e.id));
  const arTot=ar.filter(r=>r.status!=="Paid"&&gf.entityIds.includes(r.entityId)).reduce((s,r)=>s+toRM(r.amount,r.currency),0);
  const apTot=ap.filter(r=>r.status!=="Paid"&&gf.entityIds.includes(r.entityId)).reduce((s,r)=>s+toRM(r.amount,r.currency),0);
  const glCount=gl.filter(j=>gf.entityIds.includes(j.entityId)).length;
  const icCount=gl.filter(j=>j.icEntityId&&gf.entityIds.includes(j.entityId)).length;
  const lastFX=fxRates[fxRates.length-1];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div><div style={{fontSize:20,fontWeight:800,color:P.text,marginBottom:3}}>{PRODUCT_NAME}</div>
      <div style={{fontSize:11,color:P.muted}}>Multi-Entity Financial Intelligence · {actE.length} entit{actE.length!==1?"ies":"y"} · FX as at {lastFX?.period||"—"} · MYR base</div></div>
      {(()=>{
        const salesData=store.sales||[];
        const spotRow2=fxRates[fxRates.length-1]||{};
        const toRM2=(amt,ccy)=>{if(ccy===BASE)return amt;if(ccy==="USD")return amt*(spotRow2.MYR||1);const r=spotRow2[ccy];const m=spotRow2.MYR;return(r&&m)?amt*(m/r):amt;};
        const wonRevenue=salesData.filter(d=>d.stage==="Won"&&gf.entityIds.includes(d.entityId)).reduce((s,d)=>s+toRM2(d.value,d.currency),0);
        const pipeline=salesData.filter(d=>!["Won","Lost"].includes(d.stage)&&gf.entityIds.includes(d.entityId)).reduce((s,d)=>s+toRM2(d.value,d.currency),0);
        return(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
            <KPI label="AR Outstanding"  value={fmtK(arTot)}      color={P.green}  accent={P.green}  small/>
            <KPI label="AP Outstanding"  value={fmtK(apTot)}      color={P.mag}    accent={P.mag}    small/>
            <KPI label="Won Revenue"     value={fmtK(wonRevenue)}  color={P.gold}   accent={P.gold}   small sub="sales pipeline"/>
            <KPI label="Pipeline"        value={fmtK(pipeline)}    color={P.blue}   accent={P.blue}   small sub="active deals"/>
            <KPI label="GL Entries"      value={glCount}           color={P.purple} accent={P.purple} small/>
            <KPI label="Assets"          value={(store.assets||[]).filter(a=>a.active&&gf.entityIds.includes(a.entityId)).length} color={P.blue} small/>
            <KPI label="Headcount"       value={(store.headcount||[]).filter(h=>h.active&&gf.entityIds.includes(h.entityId)).length} color={P.orange} small/>
            <KPI label="COA Accounts"    value={coa.filter(a=>a.active).length} color={P.sub} small/>
          </div>
        );
      })()}
      <Card title="Entity Snapshot">
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
          {actE.map(e=>{
            const eAR=ar.filter(r=>r.entityId===e.id&&r.status!=="Paid").reduce((s,r)=>s+toRM(r.amount,r.currency),0);
            const eAP=ap.filter(r=>r.entityId===e.id&&r.status!=="Paid").reduce((s,r)=>s+toRM(r.amount,r.currency),0);
            const eGL=gl.filter(j=>j.entityId===e.id).length;
            return(
              <div key={e.id} style={{background:P.surf2,border:`1px solid ${e.color}40`,borderRadius:10,padding:"12px 14px"}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}><EntityDot entity={e} size={8}/><span style={{color:P.text,fontWeight:700,fontSize:12,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.name}</span><Badge label={e.currency} color={e.color}/></div>
                <div style={{fontSize:10,color:P.muted,marginBottom:8}}>{e.country} · {e.type}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                  <div><div style={{color:P.muted,fontSize:9}}>AR</div><div style={{color:P.green,fontFamily:"monospace",fontSize:11,fontWeight:700}}>{fmtK(eAR)}</div></div>
                  <div><div style={{color:P.muted,fontSize:9}}>AP</div><div style={{color:P.mag,fontFamily:"monospace",fontSize:11,fontWeight:700}}>{fmtK(eAP)}</div></div>
                  <div><div style={{color:P.muted,fontSize:9}}>GL</div><div style={{color:P.blue,fontFamily:"monospace",fontSize:11,fontWeight:700}}>{eGL}</div></div>
                  <div><div style={{color:P.muted,fontSize:9}}>Deals</div><div style={{color:P.green,fontFamily:"monospace",fontSize:11,fontWeight:700}}>{(store.sales||[]).filter(d=>d.entityId===e.id&&d.stage==="Won").length}W</div></div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SIDEBAR + NAV
// ══════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════
// MODULE: BUDGET VS ACTUAL
// ══════════════════════════════════════════════════════════════════
function BudgetModule({gf}){
  const {store,setStore}=useStore();
  const {budget,gl,coa,entities,fxRates}=store;
  const [tab,setTab]=useState("variance");
  const [fEntity,setFEntity]=useState(gf.entityIds[0]||entities[0]?.id||"");
  const [fPeriod,setFPeriod]=useState(gf.periodTo||fxRates[fxRates.length-1]?.period||"");
  const [viewMode,setViewMode]=useState("period"); // period | ytd
  const [editRow,setEditRow]=useState(null);
  const [editVal,setEditVal]=useState("");

  const activeE=entities.filter(e=>e.active&&gf.entityIds.includes(e.id));
  if(activeE.length&&!activeE.find(e=>e.id===fEntity)) setFEntity(activeE[0].id);

  const periods=fxRates.map(r=>r.period);
  const entity=entities.find(e=>e.id===fEntity);

  // YTD periods up to fPeriod
  const ytdPeriods=useMemo(()=>{
    const idx=periods.indexOf(fPeriod);
    return idx>=0?periods.slice(0,idx+1):[];
  },[periods,fPeriod]);

  // Actual from GL (already in functional currency)
  function getActual(entityId,accountCode,forPeriods){
    const entries=gl.filter(j=>j.entityId===entityId&&forPeriods.includes(j.period));
    let dr=0,cr=0;
    entries.forEach(j=>{
      if(j.drAccount===accountCode) dr+=j.amount;
      if(j.crAccount===accountCode) cr+=j.amount;
    });
    const acct=coa.find(a=>a.code===accountCode);
    const net=dr-cr;
    // Translate to MYR using average rate over the periods
    const rates=forPeriods.map(p=>getFxRate(fxRates,p,entity?.currency||BASE));
    const avgRate=rates.length?rates.reduce((a,b)=>a+b,0)/rates.length:1;
    // For P&L accounts sign: Revenue is credit-normal (negative net = revenue)
    const cls=IFRS_CLASSES.find(c=>c.id===acct?.class);
    const signedNet=cls?.sign?net*cls.sign:net;
    return {localAmt:signedNet, myrAmt:signedNet*avgRate, rate:avgRate};
  }

  // Budget for entity+period
  function getBudget(entityId,accountCode,forPeriods){
    const rows=budget.filter(b=>b.entityId===entityId&&forPeriods.includes(b.period)&&b.accountCode===accountCode);
    return rows.reduce((s,b)=>s+b.budgetMYR,0);
  }

  function setBudgetCell(entityId,period,accountCode,val){
    const existing=budget.findIndex(b=>b.entityId===entityId&&b.period===period&&b.accountCode===accountCode);
    let updated;
    if(existing>=0) updated=budget.map((b,i)=>i===existing?{...b,budgetMYR:parseFloat(val)||0}:b);
    else updated=[...budget,{entityId,period,accountCode,budgetMYR:parseFloat(val)||0}];
    const ns={...store,budget:updated};setStore(ns);persist(ns);
  }

  // Build variance rows for active P&L + BS accounts that have GL or budget data
  const relevantAccounts=useMemo(()=>{
    const pds=viewMode==="ytd"?ytdPeriods:[fPeriod];
    const acctCodes=new Set([
      ...gl.filter(j=>j.entityId===fEntity&&pds.includes(j.period)).flatMap(j=>[j.drAccount,j.crAccount]),
      ...budget.filter(b=>b.entityId===fEntity&&pds.includes(b.period)).map(b=>b.accountCode),
    ]);
    return [...acctCodes].map(code=>{
      const acct=coa.find(a=>a.code===code);
      const actual=getActual(fEntity,code,pds);
      const bud=getBudget(fEntity,code,pds);
      const varAbs=actual.myrAmt-bud;
      const varPct=bud!==0?((varAbs/Math.abs(bud))*100):null;
      // Favourable: for revenue, actual>budget is good; for expenses, actual<budget is good
      const isCostAcc=acct?.class==="X";
      const favourable=isCostAcc?varAbs<=0:varAbs>=0;
      return {code,name:acct?.name||code,class:acct?.class||"?",group:acct?.group||"",
        actualMYR:actual.myrAmt,budgetMYR:bud,varAbs,varPct,favourable,acct};
    }).filter(r=>Math.abs(r.actualMYR)>0.01||Math.abs(r.budgetMYR)>0.01)
      .sort((a,b)=>a.code.localeCompare(b.code));
  },[gl,budget,fEntity,fPeriod,viewMode,ytdPeriods,coa,entity,fxRates]);

  const totBudget=relevantAccounts.reduce((s,r)=>s+r.budgetMYR,0);
  const totActual=relevantAccounts.reduce((s,r)=>s+r.actualMYR,0);
  const totVar=totActual-totBudget;
  const favCount=relevantAccounts.filter(r=>r.favourable).length;
  const unfavCount=relevantAccounts.filter(r=>!r.favourable&&Math.abs(r.varAbs)>100).length;

  // Chart data — top 8 accounts by absolute variance
  const chartData=[...relevantAccounts].sort((a,b)=>Math.abs(b.varAbs)-Math.abs(a.varAbs)).slice(0,8).map(r=>({
    name:r.name.length>18?r.name.slice(0,16)+"…":r.name,
    Budget:r.budgetMYR, Actual:r.actualMYR, Variance:r.varAbs,
    fill:r.favourable?P.green:P.red,
  }));

  function handleBudgetUpload(rows){
    const hdrs=rows[0].map(h=>h.trim().toUpperCase());
    const col=k=>hdrs.findIndex(h=>h===k);
    const parsed=rows.slice(1).map(r=>({
      entityId:r[col("ENTITYID")]||fEntity,
      period:r[col("PERIOD")]||fPeriod,
      accountCode:r[col("ACCOUNTCODE")]||"",
      budgetMYR:parseFloat(r[col("BUDGETMYR")])||0,
    })).filter(r=>r.accountCode&&r.budgetMYR);
    const ns={...store,budget:[...budget,...parsed]};setStore(ns);persist(ns);
  }

  function dlBudgetTemplate(){
    const hdr="EntityId,Period,AccountCode,BudgetMYR\n";
    const ex=`${fEntity},${fPeriod},4000,80000\n${fEntity},${fPeriod},5100,35000\n${fEntity},${fPeriod},5400,10000`;
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([hdr+ex],{type:"text/csv"}));a.download="budget_template.csv";a.click();
  }

  const varClr=v=>v==null?"—":v>0?"▲ "+v.toFixed(1)+"%":"▼ "+Math.abs(v).toFixed(1)+"%";

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Controls bar */}
      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",background:P.surf2,borderRadius:10,padding:"10px 14px",border:`1px solid ${P.border}`}}>
        <Sel value={fEntity} onChange={setFEntity} style={{width:180}}>
          {activeE.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
        </Sel>
        <Sel value={fPeriod} onChange={setFPeriod} style={{width:130}}>
          {periods.map(p=><option key={p}>{p}</option>)}
        </Sel>
        <div style={{display:"flex",gap:3,background:P.bg2,borderRadius:7,padding:3,border:`1px solid ${P.border}`}}>
          {["period","ytd"].map(m=>(
            <button key={m} onClick={()=>setViewMode(m)} style={{padding:"4px 12px",borderRadius:5,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:600,background:viewMode===m?P.gold:"transparent",color:viewMode===m?"#0B0F1A":P.muted}}>
              {m==="period"?"Period":"YTD"}
            </button>
          ))}
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:12,fontSize:11}}>
          <span style={{color:P.green}}>✓ Fav: {favCount}</span>
          <span style={{color:P.red}}>✗ Unfav: {unfavCount}</span>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10}}>
        <KPI label={`Budget (${viewMode.toUpperCase()})`} value={fmtK(totBudget)} color={P.blue}   accent={P.blue}   small/>
        <KPI label={`Actual (${viewMode.toUpperCase()})`} value={fmtK(totActual)} color={P.gold}   accent={P.gold}   small/>
        <KPI label="Total Variance" value={fmtK(totVar)}  color={totVar>=0?P.green:P.red} accent={totVar>=0?P.green:P.red} small sub={totBudget?fmtPct(pct(totBudget,totActual)):""}/>
        <KPI label="Favourable Lines"   value={favCount}   color={P.green}  small/>
        <KPI label="Unfavourable Lines" value={unfavCount} color={P.red}    small/>
      </div>

      <SubTabs tabs={[{id:"variance",label:"Variance Analysis"},{id:"chart",label:"Chart"},{id:"insights",label:"📊 Insights"},{id:"input",label:"Budget Input"},{id:"upload",label:"Upload"}]} active={tab} onChange={setTab}/>

      {tab==="insights"&&<BudgetInsights periods={periods} budget={budget} fEntity={fEntity} getActual={getActual} coa={coa}/>}

      {tab==="variance"&&(
        <Card noPad>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:P.surf2}}>
                {["Code","Account","Class","Group","Budget MYR","Actual MYR","Variance MYR","Var %","Status"].map(h=>(
                  <th key={h} style={{textAlign:["Budget MYR","Actual MYR","Variance MYR"].includes(h)?"right":"left",padding:"8px 10px",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {IFRS_CLASSES.map(cls=>{
                  const rows=relevantAccounts.filter(r=>r.class===cls.id);
                  if(!rows.length) return null;
                  const clr=cls.id==="A"?P.blue:cls.id==="L"?P.orange:cls.id==="E"?P.purple:cls.id==="R"?P.green:P.red;
                  const subBud=rows.reduce((s,r)=>s+r.budgetMYR,0);
                  const subAct=rows.reduce((s,r)=>s+r.actualMYR,0);
                  const subVar=subAct-subBud;
                  return[
                    <tr key={`h${cls.id}`}><td colSpan={9} style={{padding:"7px 10px",background:P.surf2,color:clr,fontSize:10,fontWeight:700,letterSpacing:1}}>{cls.label.toUpperCase()}</td></tr>,
                    ...rows.map((r,i)=>(
                      <tr key={r.code} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}10`}}>
                        <td style={{padding:"6px 10px",fontFamily:"monospace",color:P.gold,fontSize:11,fontWeight:700}}>{r.code}</td>
                        <td style={{padding:"6px 10px",color:P.text}}>{r.name}</td>
                        <td style={{padding:"6px 10px"}}><Badge label={r.class} color={clr}/></td>
                        <td style={{padding:"6px 10px",color:P.muted,fontSize:10}}>{r.group}</td>
                        <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.sub}}>{r.budgetMYR?fmtMYR(r.budgetMYR):"—"}</td>
                        <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.text}}>{r.actualMYR?fmtMYR(r.actualMYR):"—"}</td>
                        <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:r.varAbs>=0?P.green:P.red,fontWeight:600}}>{r.varAbs?`${r.varAbs>0?"+":""}${fmtMYR(r.varAbs)}`:"—"}</td>
                        <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",fontSize:11,color:r.favourable?P.green:P.red}}>{varClr(r.varPct)}</td>
                        <td style={{padding:"6px 10px"}}><Badge label={r.favourable?"Favourable":"Unfavourable"} color={r.favourable?P.green:P.red}/></td>
                      </tr>
                    )),
                    <tr key={`s${cls.id}`} style={{background:P.surf2}}>
                      <td colSpan={4} style={{padding:"6px 10px",color:clr,fontSize:10,fontWeight:700}}>Subtotal {cls.label}</td>
                      <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.sub,fontWeight:700}}>{fmtMYR(subBud)}</td>
                      <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.text,fontWeight:700}}>{fmtMYR(subAct)}</td>
                      <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:subVar>=0?P.green:P.red,fontWeight:700}}>{`${subVar>0?"+":""}${fmtMYR(subVar)}`}</td>
                      <td colSpan={2}/>
                    </tr>,
                  ];
                })}
                <tr style={{borderTop:`2px solid ${P.gold}`,background:P.surf3}}>
                  <td colSpan={4} style={{padding:"9px 10px",color:P.gold,fontWeight:700,fontSize:12}}>TOTAL</td>
                  <td style={{padding:"9px 10px",fontFamily:"monospace",textAlign:"right",color:P.sub,fontWeight:700}}>{fmtMYR(totBudget)}</td>
                  <td style={{padding:"9px 10px",fontFamily:"monospace",textAlign:"right",color:P.text,fontWeight:700}}>{fmtMYR(totActual)}</td>
                  <td style={{padding:"9px 10px",fontFamily:"monospace",textAlign:"right",color:totVar>=0?P.green:P.red,fontWeight:700}}>{`${totVar>0?"+":""}${fmtMYR(totVar)}`}</td>
                  <td colSpan={2}/>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab==="chart"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card title="Budget vs Actual — Top 8 Accounts by Absolute Variance">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{top:5,right:20,left:0,bottom:40}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="name" tick={{fill:P.muted,fontSize:9}} angle={-20} textAnchor="end" interval={0}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Legend formatter={v=><span style={{color:P.muted,fontSize:11}}>{v}</span>}/>
                <Bar dataKey="Budget" fill={P.surf3} stroke={P.blue}  strokeWidth={1} radius={[3,3,0,0]}/>
                <Bar dataKey="Actual" fill={P.gold}  radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Variance Waterfall (MYR) — Positive = Favourable">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{top:5,right:20,left:0,bottom:40}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="name" tick={{fill:P.muted,fontSize:9}} angle={-20} textAnchor="end" interval={0}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                <ReferenceLine y={0} stroke={P.muted}/>
                <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Bar dataKey="Variance" radius={[3,3,0,0]}>
                  {chartData.map((entry,i)=><Cell key={i} fill={entry.Variance>=0?P.green:P.red}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {tab==="input"&&(
        <Card title={`Manual Budget Input — ${entity?.name||""} · ${fPeriod}`} accent={P.blue}>
          <div style={{fontSize:11,color:P.muted,marginBottom:12}}>Enter budget amounts in MYR for each account. Click a cell to edit, press Enter to save.</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {coa.filter(a=>a.active&&["R","X","A","L"].includes(a.class)).sort((a,b)=>a.code.localeCompare(b.code)).map(acct=>{
              const key=`${fEntity}-${fPeriod}-${acct.code}`;
              const current=budget.find(b=>b.entityId===fEntity&&b.period===fPeriod&&b.accountCode===acct.code);
              const isEditing=editRow===key;
              const clr=acct.class==="A"?P.blue:acct.class==="L"?P.orange:acct.class==="E"?P.purple:acct.class==="R"?P.green:P.red;
              return(
                <div key={key} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 10px",borderRadius:8,background:isEditing?`${P.gold}10`:P.surf2,border:`1px solid ${isEditing?P.gold:P.border}`}}>
                  <span style={{fontFamily:"monospace",color:P.gold,fontSize:11,width:50}}>{acct.code}</span>
                  <span style={{color:P.text,flex:1,fontSize:11}}>{acct.name}</span>
                  <Badge label={acct.class} color={clr}/>
                  {isEditing?(
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <Input value={editVal} onChange={setEditVal} type="number" style={{width:120,textAlign:"right",fontFamily:"monospace"}}/>
                      <Btn small onClick={()=>{setBudgetCell(fEntity,fPeriod,acct.code,editVal);setEditRow(null);setEditVal("");}}>Save</Btn>
                      <Btn small outline color={P.muted} onClick={()=>{setEditRow(null);setEditVal("");}}>✕</Btn>
                    </div>
                  ):(
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{fontFamily:"monospace",color:current?P.gold:P.muted,fontSize:11,width:100,textAlign:"right"}}>{current?fmtMYR(current.budgetMYR):"—"}</span>
                      <Btn small outline color={P.gold} onClick={()=>{setEditRow(key);setEditVal(current?.budgetMYR||"");}}>Edit</Btn>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {tab==="upload"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card title="Upload Budget Data">
            <DropZone onRows={handleBudgetUpload} label="Drop budget file (.xlsx or .csv)"/>
            <div style={{marginTop:8,fontSize:10,color:P.muted}}>Required: <span style={{color:P.gold}}>EntityId, Period, AccountCode, BudgetMYR</span></div>
            <button onClick={dlBudgetTemplate} style={{marginTop:8,background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,color:P.muted,fontSize:10,padding:"4px 10px",cursor:"pointer",fontFamily:"inherit"}}>↓ Budget Template CSV</button>
          </Card>
          <Card title="Tip — Linking Budget to COA" accent={P.blue}>
            <div style={{fontSize:11,color:P.muted}}>AccountCode must match codes defined in your Chart of Accounts. Current entity IDs: {entities.map(e=><span key={e.id} style={{color:e.color,marginRight:8}}>{e.id} ({e.name})</span>)}</div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MODULE: CASH FLOW STATEMENT (indirect method)
// ══════════════════════════════════════════════════════════════════
function CashFlowModule({gf}){
  const {store,setStore}=useStore();
  const {gl,coa,entities,fxRates,ar,ap}=store;
  const [fPeriod,setFPeriod]=useState(gf.periodTo||fxRates[fxRates.length-1]?.period||"");
  const [prevPeriod,setPrevPeriod]=useState("");
  const [tab,setTab]=useState("statement");

  const periods=fxRates.map(r=>r.period);
  const prevIdx=periods.indexOf(fPeriod)-1;
  const defaultPrev=prevIdx>=0?periods[prevIdx]:"";

  // Use prevPeriod state or default to prior period
  const comparePeriod=prevPeriod||defaultPrev;

  // Spot rate helpers
  const spotRate=(period,ccy)=>getFxRate(fxRates,period,ccy);

  // Get GL net for account+period across all filtered entities (in MYR)
  function getGLNet(accountCode,period){
    let dr=0,cr=0;
    gf.entityIds.forEach(eid=>{
      const entity=entities.find(e=>e.id===eid);
      const ccy=entity?.currency||BASE;
      gl.filter(j=>j.entityId===eid&&j.period===period).forEach(j=>{
        const rate=spotRate(period,ccy);
        if(j.drAccount===accountCode){dr+=j.amount*rate;}
        if(j.crAccount===accountCode){cr+=j.amount*rate;}
      });
    });
    return dr-cr;
  }

  // Net profit from P&L (Revenue - Expenses) — from GL for the period
  const revenueAccts=coa.filter(a=>a.class==="R"&&a.active);
  const expenseAccts=coa.filter(a=>a.class==="X"&&a.active);

  const revenue=revenueAccts.reduce((s,a)=>s-getGLNet(a.code,fPeriod),0); // credit-normal = negate net
  const expenses=expenseAccts.reduce((s,a)=>s+getGLNet(a.code,fPeriod),0);
  const netProfit=revenue-expenses;

  // Add-backs: depreciation (account 5300) and other non-cash
  const deprnCode="5300";
  const deprn=getGLNet(deprnCode,fPeriod);

  // Working capital movements (change in BS accounts between periods)
  function wcMovement(accountCode,currPeriod,prevPer){
    const curr=getGLNet(accountCode,currPeriod);
    const prev=prevPer?getGLNet(accountCode,prevPer):0;
    return prev-curr; // decrease in assets = cash inflow (positive)
  }

  const wcItems=[
    {label:"(Increase)/Decrease in Receivables",    code:"1100", movement:wcMovement("1100",fPeriod,comparePeriod)},
    {label:"(Increase)/Decrease in IC Receivables", code:"1150", movement:wcMovement("1150",fPeriod,comparePeriod)},
    {label:"(Increase)/Decrease in Inventory",      code:"1200", movement:wcMovement("1200",fPeriod,comparePeriod)},
    {label:"Increase/(Decrease) in Payables",       code:"2000", movement:-(wcMovement("2000",fPeriod,comparePeriod))},
    {label:"Increase/(Decrease) in IC Payables",    code:"2050", movement:-(wcMovement("2050",fPeriod,comparePeriod))},
    {label:"Increase/(Decrease) in Accruals",       code:"2100", movement:-(wcMovement("2100",fPeriod,comparePeriod))},
  ];

  const totalWC=wcItems.reduce((s,i)=>s+i.movement,0);
  const operatingCF=netProfit+deprn+totalWC;

  // Investing — PPE movements
  const ppePurchases=-getGLNet("1500",fPeriod); // Dr to PPE = purchase (outflow)
  const investingCF=ppePurchases;

  // Financing — debt movements
  const debtMovement=-(getGLNet("2500",fPeriod)); // negative = repayment
  const financingCF=debtMovement;

  // Net cash movement
  const netCash=operatingCF+investingCF+financingCF;

  // Opening cash = net GL of 1000 in previous period
  const openingCash=comparePeriod?getGLNet("1000",comparePeriod):0;
  const closingCash=openingCash+netCash;

  // Chart data for waterfall
  const waterfallData=[
    {name:"Net Profit",    value:netProfit,   color:netProfit>=0?P.green:P.red},
    {name:"Depreciation",  value:deprn,       color:P.blue},
    {name:"Working Capital",value:totalWC,    color:totalWC>=0?P.green:P.orange},
    {name:"Operating CF",  value:operatingCF, color:operatingCF>=0?P.green:P.red},
    {name:"Investing CF",  value:investingCF, color:investingCF>=0?P.green:P.red},
    {name:"Financing CF",  value:financingCF, color:financingCF>=0?P.green:P.red},
    {name:"Net Cash",      value:netCash,     color:netCash>=0?P.green:P.red},
  ];

  // Manual CF items (investing/financing additions)
  const [cfItems,setCfItems]=useState([]);
  const [cfForm,setCfForm]=useState({section:"investing",label:"",amount:""});

  function addCfItem(){
    if(!cfForm.label||!cfForm.amount) return;
    setCfItems(prev=>[...prev,{...cfForm,id:uid(),amount:parseFloat(cfForm.amount)}]);
    setCfForm({section:"investing",label:"",amount:""});
  }
  const manualInvesting=cfItems.filter(i=>i.section==="investing").reduce((s,i)=>s+i.amount,0);
  const manualFinancing=cfItems.filter(i=>i.section==="financing").reduce((s,i)=>s+i.amount,0);
  const totalInvesting=investingCF+manualInvesting;
  const totalFinancing=financingCF+manualFinancing;
  const totalNet=operatingCF+totalInvesting+totalFinancing;

  function Row({label,value,bold,indent,color}){
    return(
      <tr>
        <td style={{padding:"6px 10px",color:bold?P.text:P.sub,fontSize:11,paddingLeft:indent?24:10,fontWeight:bold?700:400}}>{label}</td>
        <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:color||(value>=0?P.text:P.orange),fontWeight:bold?700:400,fontSize:11}}>{fmtMYR(value)}</td>
      </tr>
    );
  }
  function SectionHead2({label,color}){
    return(
      <tr><td colSpan={2} style={{padding:"10px 10px 5px",color:color||P.gold,fontSize:10,fontWeight:700,letterSpacing:1,background:P.surf2,borderTop:`1px solid ${P.border}`}}>{label}</td></tr>
    );
  }

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Controls */}
      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",background:P.surf2,borderRadius:10,padding:"10px 14px",border:`1px solid ${P.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:P.muted,fontSize:11}}>Period</span>
          <Sel value={fPeriod} onChange={setFPeriod} style={{width:130}}>{periods.map(p=><option key={p}>{p}</option>)}</Sel>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:P.muted,fontSize:11}}>Compare to</span>
          <Sel value={comparePeriod} onChange={setPrevPeriod} style={{width:130}}>
            <option value="">Prior period (auto)</option>
            {periods.filter(p=>p!==fPeriod).map(p=><option key={p}>{p}</option>)}
          </Sel>
        </div>
        <div style={{marginLeft:"auto",fontSize:11,color:P.muted}}>
          Method: <span style={{color:P.gold}}>Indirect</span> · {gf.entityIds.length} entit{gf.entityIds.length!==1?"ies":"y"} consolidated
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        <KPI label="Net Profit"      value={fmtK(netProfit)}     color={netProfit>=0?P.green:P.red}     accent={netProfit>=0?P.green:P.red}     small/>
        <KPI label="Operating CF"    value={fmtK(operatingCF)}   color={operatingCF>=0?P.green:P.red}   accent={operatingCF>=0?P.green:P.red}   small/>
        <KPI label="Investing CF"    value={fmtK(totalInvesting)} color={totalInvesting>=0?P.green:P.red} accent={P.purple}                      small/>
        <KPI label="Financing CF"    value={fmtK(totalFinancing)} color={totalFinancing>=0?P.green:P.red} accent={P.blue}                        small/>
        <KPI label="Net Cash Movement" value={fmtK(totalNet)}    color={totalNet>=0?P.green:P.red}       small/>
        <KPI label="Closing Cash"    value={fmtK(closingCash)}   color={P.gold}  accent={P.gold}         small sub={`Opening: ${fmtK(openingCash)}`}/>
      </div>

      <SubTabs tabs={[{id:"statement",label:"Statement"},{id:"chart",label:"Waterfall"},{id:"insights",label:"📊 Insights"},{id:"manual",label:"Manual Items"}]} active={tab} onChange={setTab}/>

      {tab==="statement"&&(
        <Card noPad title={`Cash Flow Statement (Indirect) — ${fPeriod} · Group MYR`}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <tbody>
                <SectionHead2 label="A. OPERATING ACTIVITIES" color={P.green}/>
                <Row label="Net Profit / (Loss)" value={netProfit} bold/>
                <tr><td colSpan={2} style={{padding:"4px 10px",color:P.muted,fontSize:9,fontStyle:"italic"}}>Adjustments for non-cash items:</td></tr>
                <Row label="Add: Depreciation & Amortisation" value={deprn} indent/>
                <tr><td colSpan={2} style={{padding:"4px 10px",color:P.muted,fontSize:9,fontStyle:"italic"}}>Working capital movements:</td></tr>
                {wcItems.map(i=><Row key={i.code} label={i.label} value={i.movement} indent/>)}
                <Row label="Net Cash from Operating Activities" value={operatingCF} bold color={operatingCF>=0?P.green:P.red}/>

                <SectionHead2 label="B. INVESTING ACTIVITIES" color={P.purple}/>
                <Row label="(Purchase)/Disposal of PPE" value={ppePurchases} indent/>
                {cfItems.filter(i=>i.section==="investing").map(i=><Row key={i.id} label={i.label} value={i.amount} indent/>)}
                <Row label="Net Cash from Investing Activities" value={totalInvesting} bold color={totalInvesting>=0?P.green:P.red}/>

                <SectionHead2 label="C. FINANCING ACTIVITIES" color={P.blue}/>
                <Row label="Net Borrowings / (Repayments)" value={debtMovement} indent/>
                {cfItems.filter(i=>i.section==="financing").map(i=><Row key={i.id} label={i.label} value={i.amount} indent/>)}
                <Row label="Net Cash from Financing Activities" value={totalFinancing} bold color={totalFinancing>=0?P.green:P.red}/>

                <SectionHead2 label="D. NET CASH MOVEMENT" color={P.gold}/>
                <Row label="Net Increase / (Decrease) in Cash" value={totalNet} bold color={totalNet>=0?P.green:P.red}/>
                <Row label="Opening Cash Balance" value={openingCash}/>
                <Row label="Closing Cash Balance" value={closingCash} bold color={P.gold}/>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab==="chart"&&(
        <Card title="Cash Flow Bridge — MYR">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={waterfallData} margin={{top:5,right:20,left:0,bottom:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
              <XAxis dataKey="name" tick={{fill:P.muted,fontSize:10}}/>
              <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
              <ReferenceLine y={0} stroke={P.muted}/>
              <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
              <Bar dataKey="value" radius={[4,4,0,0]}>
                {waterfallData.map((entry,i)=><Cell key={i} fill={entry.color}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {tab==="insights"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {(()=>{
            const cfTrend=periods.slice(-6).map(p=>{
              const pRev=revenueAccts.reduce((s,a)=>s-getGLNet(a.code,p),0);
              const pExp=expenseAccts.reduce((s,a)=>s+getGLNet(a.code,p),0);
              const pProfit=pRev-pExp;
              const pDeprn=getGLNet(deprnCode,p);
              const pOp=pProfit+pDeprn;
              return {period:p,revenue:pRev,expenses:pExp,profit:pProfit,operatingCF:pOp,deprn:pDeprn};
            });
            return(<>
              <InsightPanel title="Revenue, Expenses & Net Profit — Trend">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={cfTrend} margin={{top:5,right:20,left:0,bottom:5}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                    <XAxis dataKey="period" tick={{fill:P.muted,fontSize:10}}/>
                    <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                    <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                    <Legend formatter={v=><span style={{color:P.muted,fontSize:11}}>{v}</span>}/>
                    <Bar dataKey="revenue"  name="Revenue"  fill={P.green}  radius={[3,3,0,0]}/>
                    <Bar dataKey="expenses" name="Expenses" fill={P.red}    radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </InsightPanel>
              <InsightPanel title="Operating CF vs Net Profit — Earnings to Cash Conversion">
                <div style={{fontSize:10,color:P.muted,marginBottom:8}}>Operating CF above Net Profit = strong cash conversion. Gap = working capital drag or non-cash items.</div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={cfTrend} margin={{top:5,right:20,left:0,bottom:5}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                    <XAxis dataKey="period" tick={{fill:P.muted,fontSize:10}}/>
                    <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                    <ReferenceLine y={0} stroke={P.muted} strokeDasharray="4 4"/>
                    <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                    <Legend formatter={v=><span style={{color:P.muted,fontSize:11}}>{v}</span>}/>
                    <Line type="monotone" dataKey="profit"      name="Net Profit"   stroke={P.gold}  strokeWidth={2} dot={{r:3}}/>
                    <Line type="monotone" dataKey="operatingCF" name="Operating CF" stroke={P.green} strokeWidth={2} dot={{r:3}} strokeDasharray="5 3"/>
                  </LineChart>
                </ResponsiveContainer>
              </InsightPanel>
            </>);
          })()}
          <InsightPanel title="CF Component Breakdown — Current Period">
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
              {[
                {label:"Operating",  value:operatingCF,    color:P.green},
                {label:"Investing",  value:totalInvesting, color:P.purple},
                {label:"Financing",  value:totalFinancing, color:P.blue},
                {label:"Net Movement",value:totalNet,      color:totalNet>=0?P.green:P.red},
              ].map(item=>(
                <div key={item.label} style={{background:P.surf2,border:`1px solid ${item.color}30`,borderRadius:9,padding:"10px 12px",textAlign:"center"}}>
                  <div style={{color:item.color,fontSize:9,fontWeight:700,letterSpacing:1,marginBottom:6}}>{item.label.toUpperCase()}</div>
                  <div style={{color:item.value>=0?P.green:P.red,fontFamily:"monospace",fontSize:13,fontWeight:700}}>{fmtK(item.value)}</div>
                  <div style={{marginTop:6,height:3,background:P.border,borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${Math.min(100,Math.abs(totalNet)?Math.abs(item.value/totalNet)*100:0)}%`,background:item.color,borderRadius:2}}/>
                  </div>
                </div>
              ))}
            </div>
          </InsightPanel>
        </div>
      )}

      {tab==="manual"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card title="Add Manual Cash Flow Items" accent={P.blue}>
            <div style={{fontSize:11,color:P.muted,marginBottom:10}}>Add investing or financing items not captured in GL (e.g. equity injections, dividend payments, asset disposals).</div>
            <div style={{display:"grid",gridTemplateColumns:"140px 1fr 130px auto",gap:8,alignItems:"end"}}>
              <div>
                <div style={{color:P.muted,fontSize:9,marginBottom:3}}>SECTION</div>
                <Sel value={cfForm.section} onChange={v=>setCfForm(f=>({...f,section:v}))} style={{width:"100%"}}>
                  <option value="investing">Investing</option>
                  <option value="financing">Financing</option>
                  <option value="operating">Operating</option>
                </Sel>
              </div>
              <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>DESCRIPTION</div><Input value={cfForm.label} onChange={v=>setCfForm(f=>({...f,label:v}))} placeholder="e.g. Proceeds from asset disposal"/></div>
              <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>AMOUNT (MYR)</div><Input value={cfForm.amount} onChange={v=>setCfForm(f=>({...f,amount:v}))} type="number" placeholder="Use negative for outflow"/></div>
              <div style={{paddingTop:16}}><Btn onClick={addCfItem} small>+ Add</Btn></div>
            </div>
          </Card>
          {cfItems.length>0&&(
            <Card title="Manual Items Added" noPad>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:P.surf2}}>{["Section","Description","Amount (MYR)",""].map(h=><th key={h} style={{padding:"7px 10px",textAlign:h==="Amount (MYR)"?"right":"left",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10}}>{h}</th>)}</tr></thead>
                <tbody>{cfItems.map((i,idx)=>(
                  <tr key={i.id} style={{borderBottom:`1px solid ${P.border}20`}}>
                    <td style={{padding:"6px 10px"}}><Badge label={i.section} color={i.section==="investing"?P.purple:i.section==="financing"?P.blue:P.green}/></td>
                    <td style={{padding:"6px 10px",color:P.text}}>{i.label}</td>
                    <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:i.amount>=0?P.green:P.red,fontWeight:700}}>{fmtMYR(i.amount)}</td>
                    <td style={{padding:"6px 10px"}}><Btn onClick={()=>setCfItems(p=>p.filter(x=>x.id!==i.id))} small outline danger>✕</Btn></td>
                  </tr>
                ))}</tbody>
              </table>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// EXTRACTED INSIGHT SUB-COMPONENTS (avoid hooks-in-render anti-pattern)
// ══════════════════════════════════════════════════════════════════
function ICInsights({gf,gl,coa,entities,fxRates,fPeriod,periods}){
  const lastTwo=periods.slice(-2);
  const [iP1,setIP1]=useState(lastTwo[0]||periods[0]||"");
  const [iP2,setIP2]=useState(lastTwo[1]||periods[0]||"");

  const icTrend=periods.map(p=>{
    const j=gl.filter(x=>x.icEntityId&&gf.entityIds.includes(x.entityId)&&x.period===p);
    const vol=j.reduce((s,x)=>s+x.amount*getFxRate(fxRates,p,x.currency),0);
    return{period:p,volume:vol,transactions:j.length};
  });

  const pairMatrix=[];
  gf.entityIds.forEach(e1=>{
    gf.entityIds.forEach(e2=>{
      if(e1>=e2) return;
      const e1ent=entities.find(e=>e.id===e1),e2ent=entities.find(e=>e.id===e2);
      const vol1=gl.filter(j=>j.entityId===e1&&j.icEntityId===e2&&j.period===fPeriod).reduce((s,j)=>s+j.amount*getFxRate(fxRates,fPeriod,j.currency),0);
      const vol2=gl.filter(j=>j.entityId===e2&&j.icEntityId===e1&&j.period===fPeriod).reduce((s,j)=>s+j.amount*getFxRate(fxRates,fPeriod,j.currency),0);
      if(vol1>0||vol2>0) pairMatrix.push({pair:`${e1ent?.name||e1} ↔ ${e2ent?.name||e2}`,vol1,vol2,e1ent,e2ent});
    });
  });

  const getMetrics=(p)=>{
    const allJ=gl.filter(j=>gf.entityIds.includes(j.entityId)&&j.period===p);
    const drSum=(cls)=>allJ.reduce((s,j)=>{const a=coa.find(a=>a.code===j.drAccount);return a?.class===cls?s+j.amount*getFxRate(fxRates,p,j.currency):s;},0);
    const crSum=(cls)=>allJ.reduce((s,j)=>{const a=coa.find(a=>a.code===j.crAccount);return a?.class===cls?s+j.amount*getFxRate(fxRates,p,j.currency):s;},0);
    const rev=crSum("R")-drSum("R");
    const exp=drSum("X")-crSum("X");
    return{revenue:rev,expenses:exp,profit:rev-exp};
  };
  const m1=getMetrics(iP1),m2=getMetrics(iP2);
  const plData=[
    {metric:"Revenue",[iP1]:m1.revenue,[iP2]:m2.revenue},
    {metric:"Expenses",[iP1]:m1.expenses,[iP2]:m2.expenses},
    {metric:"Net Profit",[iP1]:m1.profit,[iP2]:m2.profit},
  ];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <PeriodComparePicker periods={periods} p1={iP1} p2={iP2} onP1={setIP1} onP2={setIP2} label1="Compare" label2="To"/>
      <InsightPanel title="Group P&L Comparison — Period on Period">
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
          {[["Revenue",m1.revenue,m2.revenue,P.green],["Expenses",m1.expenses,m2.expenses,P.red],["Net Profit",m1.profit,m2.profit,m2.profit>=0?P.green:P.red]].map(([label,v1,v2,clr])=>(
            <div key={label} style={{background:P.surf3,borderRadius:8,padding:"10px 14px",border:`1px solid ${P.bord2}`}}>
              <div style={{color:P.muted,fontSize:9,marginBottom:4}}>{label}</div>
              <div style={{fontSize:12,color:P.sub,fontFamily:"monospace"}}>{fmtK(v1)} <span style={{fontSize:9,color:P.muted}}>({iP1})</span></div>
              <div style={{fontSize:15,fontWeight:700,color:clr,fontFamily:"monospace",marginTop:3}}>{fmtK(v2)}<Delta current={v2} previous={v1} invert={label==="Expenses"}/></div>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={plData} margin={{top:0,right:16,left:0,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
            <XAxis dataKey="metric" tick={{fill:P.muted,fontSize:11}}/>
            <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
            <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
            <Legend formatter={v=><span style={{color:P.muted,fontSize:10}}>{v}</span>}/>
            <Bar dataKey={iP1} fill={`${P.blue}70`} radius={[3,3,0,0]}/>
            <Bar dataKey={iP2} fill={P.gold} radius={[3,3,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </InsightPanel>
      <InsightPanel title="IC Transaction Volume — All Periods">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={icTrend} margin={{top:0,right:16,left:0,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
            <XAxis dataKey="period" tick={{fill:P.muted,fontSize:9}}/>
            <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
            <Tooltip formatter={(v,n)=>n==="volume"?[fmtMYR(v),"IC Volume"]:v} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
            <Line type="monotone" dataKey="volume"       stroke={P.gold} strokeWidth={2} dot={{r:3}} name="IC Volume (MYR)"/>
            <Line type="monotone" dataKey="transactions" stroke={P.blue} strokeWidth={2} dot={{r:2}} name="IC Entries"/>
          </LineChart>
        </ResponsiveContainer>
      </InsightPanel>
      {pairMatrix.length>0&&(
        <InsightPanel title={`Entity-Pair IC Flows — ${fPeriod}`}>
          {pairMatrix.map((pair,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<pairMatrix.length-1?`1px solid ${P.border}20`:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,width:180}}><EntityDot entity={pair.e1ent} size={6}/><span style={{color:pair.e1ent?.color||P.muted,fontSize:11}}>{pair.e1ent?.name}</span></div>
              <div style={{flex:1,position:"relative",height:6,background:P.border,borderRadius:3}}>
                <div style={{position:"absolute",left:0,top:0,height:6,width:`${pair.vol1/(pair.vol1+pair.vol2+1)*100}%`,background:pair.e1ent?.color||P.blue,borderRadius:3}}/>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:5,width:180,justifyContent:"flex-end"}}><span style={{color:pair.e2ent?.color||P.muted,fontSize:11}}>{pair.e2ent?.name}</span><EntityDot entity={pair.e2ent} size={6}/></div>
              <div style={{textAlign:"right",minWidth:80,fontFamily:"monospace",color:P.gold,fontSize:11,fontWeight:700}}>{fmtK(pair.vol1+pair.vol2)}</div>
            </div>
          ))}
        </InsightPanel>
      )}
    </div>
  );
}

function BudgetInsights({periods,budget,fEntity,getActual,coa}){
  const lastTwo=periods.slice(-2);
  const [bP1,setBP1]=useState(lastTwo[0]||periods[0]||"");
  const [bP2,setBP2]=useState(lastTwo[1]||periods[0]||"");

  const accuracyTrend=periods.map(p=>{
    const pBudget=budget.filter(b=>b.entityId===fEntity&&b.period===p);
    const totalBud=pBudget.reduce((s,b)=>s+b.budgetMYR,0);
    if(!totalBud) return{period:p,accuracy:null,totalBudget:0,totalActual:0,variance:0};
    const totalAct=pBudget.reduce((s,b)=>s+getActual(fEntity,b.accountCode,[p]).myrAmt,0);
    const accuracy=Math.max(0,100-Math.abs(((totalAct-totalBud)/totalBud)*100));
    return{period:p,accuracy:+accuracy.toFixed(1),totalBudget:totalBud,totalActual:totalAct,variance:totalAct-totalBud};
  }).filter(d=>d.totalBudget>0);

  const getMetrics=p=>({
    budget:budget.filter(b=>b.entityId===fEntity&&b.period===p).reduce((s,b)=>s+b.budgetMYR,0),
    actual:budget.filter(b=>b.entityId===fEntity&&b.period===p).reduce((s,b)=>s+getActual(fEntity,b.accountCode,[p]).myrAmt,0),
  });
  const m1=getMetrics(bP1),m2=getMetrics(bP2);

  const getClassSplit=p=>({
    revBud:budget.filter(b=>b.entityId===fEntity&&b.period===p&&coa.find(a=>a.code===b.accountCode)?.class==="R").reduce((s,b)=>s+b.budgetMYR,0),
    revAct:budget.filter(b=>b.entityId===fEntity&&b.period===p&&coa.find(a=>a.code===b.accountCode)?.class==="R").reduce((s,b)=>s+getActual(fEntity,b.accountCode,[p]).myrAmt,0),
    expBud:budget.filter(b=>b.entityId===fEntity&&b.period===p&&coa.find(a=>a.code===b.accountCode)?.class==="X").reduce((s,b)=>s+b.budgetMYR,0),
    expAct:budget.filter(b=>b.entityId===fEntity&&b.period===p&&coa.find(a=>a.code===b.accountCode)?.class==="X").reduce((s,b)=>s+getActual(fEntity,b.accountCode,[p]).myrAmt,0),
  });
  const s1=getClassSplit(bP1),s2=getClassSplit(bP2);
  const splitData=[
    {category:"Rev Budget",[bP1]:s1.revBud,[bP2]:s2.revBud},
    {category:"Rev Actual", [bP1]:s1.revAct,[bP2]:s2.revAct},
    {category:"Exp Budget",[bP1]:s1.expBud,[bP2]:s2.expBud},
    {category:"Exp Actual", [bP1]:s1.expAct,[bP2]:s2.expAct},
  ];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <PeriodComparePicker periods={periods} p1={bP1} p2={bP2} onP1={setBP1} onP2={setBP2}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[[bP1,m1],[bP2,m2]].map(([p,m])=>{
          const acc=m.budget>0?Math.max(0,100-Math.abs(((m.actual-m.budget)/m.budget)*100)):null;
          return(
            <div key={p} style={{background:P.surf3,border:`1px solid ${P.bord2}`,borderRadius:10,padding:"14px 16px"}}>
              <div style={{color:P.gold,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:10}}>{p}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div><div style={{color:P.muted,fontSize:9}}>BUDGET</div><div style={{color:P.sub,fontFamily:"monospace",fontSize:13,fontWeight:700}}>{fmtK(m.budget)}</div></div>
                <div><div style={{color:P.muted,fontSize:9}}>ACTUAL</div><div style={{color:m.actual>m.budget?P.green:P.red,fontFamily:"monospace",fontSize:13,fontWeight:700}}>{fmtK(m.actual)}</div></div>
                <div><div style={{color:P.muted,fontSize:9}}>VARIANCE</div><div style={{color:(m.actual-m.budget)>=0?P.green:P.red,fontFamily:"monospace",fontSize:12,fontWeight:700}}>{m.actual-m.budget>=0?"+":""}{fmtK(m.actual-m.budget)}</div></div>
                <div><div style={{color:P.muted,fontSize:9}}>ACCURACY</div><div style={{color:acc>90?P.green:acc>75?P.gold:P.red,fontFamily:"monospace",fontSize:12,fontWeight:700}}>{acc!=null?acc.toFixed(0)+"%":"—"}</div></div>
              </div>
            </div>
          );
        })}
      </div>
      <InsightPanel title="Budget Accuracy Trend — How Close Were Actuals to Budget?">
        <div style={{fontSize:10,color:P.muted,marginBottom:8}}>100% = actuals match budget exactly. Lower = larger deviation from plan.</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={accuracyTrend} margin={{top:0,right:16,left:0,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
            <XAxis dataKey="period" tick={{fill:P.muted,fontSize:9}}/>
            <YAxis domain={[0,100]} tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>`${v}%`}/>
            <ReferenceLine y={90} stroke={P.green} strokeDasharray="4 4" label={{value:"90%",fill:P.green,fontSize:9}}/>
            <Tooltip formatter={v=>`${v}%`} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
            <Line type="monotone" dataKey="accuracy" stroke={P.gold} strokeWidth={2} dot={{r:4,fill:P.gold}} name="Accuracy %"/>
          </LineChart>
        </ResponsiveContainer>
      </InsightPanel>
      <InsightPanel title="Revenue & Expense — Budget vs Actual Period Comparison">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={splitData} margin={{top:0,right:16,left:0,bottom:20}}>
            <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
            <XAxis dataKey="category" tick={{fill:P.muted,fontSize:9}} angle={-15} textAnchor="end" interval={0}/>
            <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
            <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
            <Legend formatter={v=><span style={{color:P.muted,fontSize:10}}>{v}</span>}/>
            <Bar dataKey={bP1} fill={`${P.blue}80`} radius={[3,3,0,0]}/>
            <Bar dataKey={bP2} fill={P.gold}        radius={[3,3,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </InsightPanel>
      <InsightPanel title="Variance Trend — Surplus / (Deficit) vs Budget">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={accuracyTrend} margin={{top:0,right:16,left:0,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
            <XAxis dataKey="period" tick={{fill:P.muted,fontSize:9}}/>
            <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
            <ReferenceLine y={0} stroke={P.muted}/>
            <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
            <Bar dataKey="variance" radius={[3,3,0,0]} name="Variance (MYR)">
              {accuracyTrend.map((d,i)=><Cell key={i} fill={d.variance>=0?P.green:P.red}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </InsightPanel>
    </div>
  );
}

// ── GTM-aligned navigation ─────────────────────────────────────────
// Groups follow the land-and-expand motion: ProcurFlow (WF-01…WF-05)
// then FinFlow (Lite → Pro → AI). `tier` = minimum subscription
// tier (T0–T6) at which the module is ACTIVE for client orgs.
// Admin-side Setup/Accounting items have no tier (admin sees all).
const NAV=[
  {id:"import",  icon:"⬆",  label:"Import Hub",                  group:""},
  {id:"home",    icon:"◈",  label:"Overview",                    group:"",                tier:"T0"},
  // ProcurFlow — P2P workflow automation (gold identity)
  {id:"pr",      icon:"📋",  label:"WF-01 · Requisition & Approval", group:"ProcurFlow",   tier:"T0"},
  {id:"vendors", icon:"🏢",  label:"WF-02 · Vendor Onboarding",      group:"ProcurFlow",   tier:"T1"},
  {id:"po",      icon:"📦",  label:"WF-03 · Purchase Orders",        group:"ProcurFlow",   tier:"T1"},
  {id:"gr",      icon:"✅",  label:"WF-04 · Goods Receipt",          group:"ProcurFlow",   tier:"T2"},
  {id:"sinvoice",icon:"🧾",  label:"WF-04 · Supplier Invoice",       group:"ProcurFlow",   tier:"T2"},
  {id:"payrun",  icon:"💳",  label:"WF-05 · 3-Way Match & Payment",  group:"ProcurFlow",   tier:"T2"},
  // FinFlow Lite — spend intelligence (magenta identity)
  {id:"budget",  icon:"◎",  label:"Budget vs Actual",            group:"FinFlow Lite", tier:"T3"},
  {id:"arap",    icon:"↕",  label:"AR / AP",                     group:"FinFlow Lite", tier:"T3"},
  {id:"wc",      icon:"⟳",  label:"Working Capital",             group:"FinFlow Lite", tier:"T3"},
  {id:"sales",   icon:"◉",  label:"Sales",                       group:"FinFlow Lite", tier:"T3"},
  // FinFlow Pro — close & consolidation
  {id:"close",   icon:"☑",  label:"Month-End Close",             group:"FinFlow Pro",  tier:"T4"},
  {id:"forecast",icon:"📅",  label:"13-Week Forecast",            group:"FinFlow Pro",  tier:"T4"},
  {id:"cashflow",icon:"⇌",  label:"Cash Flow",                   group:"FinFlow Pro",  tier:"T4"},
  {id:"pl",      icon:"▤",  label:"P&L",                         group:"FinFlow Pro",  tier:"T4"},
  {id:"bs",      icon:"▥",  label:"Balance Sheet",               group:"FinFlow Pro",  tier:"T4"},
  {id:"assets",  icon:"🏗",  label:"Fixed Assets",                group:"FinFlow Pro",  tier:"T4"},
  {id:"headcount",icon:"👥", label:"Headcount & Payroll",         group:"FinFlow Pro",  tier:"T4"},
  {id:"reportpack",icon:"📄",label:"Report Pack",                 group:"FinFlow Pro",  tier:"T4"},
  {id:"fx",      icon:"$",  label:"FX Rates",                    group:"FinFlow Pro",  tier:"T4"},
  // FinFlow AI — CFO assistant
  {id:"ai",      icon:"✦",  label:"AI Biz Insight",              group:"FinFlow AI",   tier:"T5"},
  // Admin-only setup & accounting (SGC implementation side, no tier)
  {id:"entities",icon:"⬡",  label:"Entities",                    group:"Setup"},
  {id:"coa",     icon:"≡",  label:"Chart of Accounts",           group:"Setup"},
  {id:"gl",      icon:"⊟",  label:"GL Ledger",                   group:"Accounting"},
  {id:"ic",      icon:"⇄",  label:"IC & Consolidation",          group:"Accounting"},
];

function Sidebar({active,setActive,store,gf,setGf}){
  const {entities}=store;
  const actE=entities.filter(e=>e.active);
  return(
    <div style={{width:216,flexShrink:0,background:P.bg2,borderRight:`1px solid ${P.border}`,display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0,overflowY:"auto"}}>
      <div style={{padding:"18px 16px 14px",borderBottom:`1px solid ${P.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:2}}>
          <div style={{width:30,height:30,borderRadius:8,background:`linear-gradient(135deg,${P.gold},${P.mag})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#0B0F1A",flexShrink:0}}>FF</div>
          <div><div style={{fontSize:13,fontWeight:800,color:P.text,letterSpacing:-0.3}}>{PRODUCT_NAME}</div><div style={{fontSize:8,color:P.muted,letterSpacing:1.2}}>MULTI-ENTITY FINANCE · v3</div></div>
        </div>
      </div>
      <div style={{padding:"8px 8px 0"}}>
        {(()=>{
          const groups=[...new Set(NAV.map(n=>n.group))];
          return groups.map(grp=>{
            const items=NAV.filter(n=>n.group===grp);
            return(
              <div key={grp}>
                {grp&&<div style={{color:P.muted,fontSize:8,fontWeight:700,letterSpacing:2,padding:"8px 9px 3px",textTransform:"uppercase"}}>{grp}</div>}
                {items.map(n=>(
                  <button key={n.id} onClick={()=>setActive(n.id)} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"7px 9px",borderRadius:8,border:"none",cursor:"pointer",background:active===n.id?`${P.gold}18`:"transparent",marginBottom:1,fontFamily:"inherit",textAlign:"left",transition:"all 0.12s"}}>
                    <span style={{fontSize:12,color:active===n.id?P.gold:P.muted,width:18,textAlign:"center",flexShrink:0}}>{n.icon}</span>
                    <span style={{fontSize:11,fontWeight:active===n.id?700:400,color:active===n.id?P.gold:P.sub,lineHeight:1.3}}>{n.label}</span>
                    {active===n.id&&<div style={{marginLeft:"auto",width:3,height:3,borderRadius:"50%",background:P.gold}}/>}
                  </button>
                ))}
              </div>
            );
          });
        })()}
      </div>
      <div style={{marginTop:8,borderTop:`1px solid ${P.border}`,flex:1}}>
        <GlobalFilters store={store} gf={gf} setGf={setGf}/>
      </div>
      <div style={{padding:"8px 14px",borderTop:`1px solid ${P.border}`,fontSize:9,color:P.muted}}>{actE.length} entit{actE.length!==1?"ies":"y"} · MYR base</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════
function FinFlowApp(){
  const [store,setStoreRaw]=useState(initStore);
  const [active,setActive]=useState("home");
  const allActiveIds=store.entities.filter(e=>e.active).map(e=>e.id);
  const [gf,setGf]=useState({periodFrom:"",periodTo:"",entityIds:allActiveIds});
  const setStore=ns=>{setStoreRaw(ns);persist(ns);};
  const ctx=useMemo(()=>({store,setStore}),[store]);
  return(
    <Ctx.Provider value={ctx}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:${P.bg2}}::-webkit-scrollbar-thumb{background:${P.border};border-radius:4px}`}</style>
      <div style={{display:"flex",minHeight:"100vh",background:P.bg,color:P.text,fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
        <Sidebar active={active} setActive={setActive} store={store} gf={gf} setGf={setGf}/>
        <div style={{flex:1,overflowY:"auto",minWidth:0}}>
          <div style={{borderBottom:`1px solid ${P.border}`,padding:"11px 22px",display:"flex",alignItems:"center",gap:12,background:`${P.surface}CC`,backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50}}>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:P.text}}>{NAV.find(n=>n.id===active)?.label||"Overview"}</div>
              <div style={{fontSize:10,color:P.muted,marginTop:1}}>{gf.entityIds.length} entit{gf.entityIds.length!==1?"ies":"y"}{gf.periodFrom||gf.periodTo?` · ${gf.periodFrom||"start"} → ${gf.periodTo||"latest"}`:" · all periods"}</div>
            </div>
            <div style={{fontSize:10,color:P.muted}}>Base: <span style={{color:P.mag,fontWeight:700}}>MYR</span></div>
          </div>
          <div style={{padding:"18px 22px",maxWidth:1160,margin:"0 auto"}}>
            {active==="import"   &&<ImportHub/>}
            {active==="home"     &&<Overview store={store} gf={gf}/>}
            {active==="entities" &&<EntityModule/>}
            {active==="coa"      &&<COAModule/>}
            {active==="fx"       &&<FXModule gf={gf}/>}
            {active==="sales"    &&<SalesModule gf={gf}/>}
            {active==="arap"     &&<ARAPModule gf={gf}/>}
            {active==="gl"       &&<GLModule gf={gf}/>}
            {active==="ic"       &&<ICModule gf={gf}/>}
            {active==="pl"       &&<PLModule gf={gf}/>}
            {active==="bs"       &&<BSModule gf={gf}/>}
            {active==="budget"   &&<BudgetModule gf={gf}/>}
            {active==="cashflow"  &&<CashFlowModule gf={gf}/>}
            {active==="wc"       &&<WorkingCapitalModule gf={gf}/>}
            {active==="forecast"  &&<RollingForecastModule gf={gf}/>}
            {active==="close"    &&<CloseTrackerModule gf={gf}/>}
            {active==="assets"   &&<FixedAssetModule gf={gf}/>}
            {active==="headcount"&&<HeadcountModule gf={gf}/>}
            {active==="reportpack"&&<ReportPackModule gf={gf}/>}
            {active==="ai"       &&<AIInsightsModule gf={gf}/>}
            {active==="vendors"  &&<VendorMasterModule gf={gf}/>}
            {active==="pr"       &&<PRModule gf={gf}/>}
            {active==="po"       &&<POModule gf={gf}/>}
            {active==="gr"       &&<GRModule gf={gf}/>}
            {active==="sinvoice" &&<SupplierInvoiceModule gf={gf}/>}
            {active==="payrun"   &&<PaymentRunModule gf={gf}/>}
          </div>
        </div>
      </div>
    </Ctx.Provider>
  );
}

// ══════════════════════════════════════════════════════════════════
// FinFlow v3 — Sales, P&L, Balance Sheet modules
// ══════════════════════════════════════════════════════════════════

// ── SALES default data ────────────────────────────────────────────
const DEAL_STAGES = ["Lead","Qualified","Proposal","Negotiation","Won","Lost"];
const STAGE_PROB  = { Lead:10, Qualified:25, Proposal:50, Negotiation:75, Won:100, Lost:0 };
const STAGE_CLR   = { Lead:"#64748B", Qualified:P.blue, Proposal:P.gold, Negotiation:P.orange, Won:P.green, Lost:P.red };

const DEFAULT_SALES = MOCK_SALES;

// ══════════════════════════════════════════════════════════════════
// MODULE: SALES
// ══════════════════════════════════════════════════════════════════
function SalesModule({gf}){
  const {store,setStore}=useStore();
  const {sales=[],entities,fxRates}=store;
  const [tab,setTab]=useState("pipeline");
  const spotRow=fxRates[fxRates.length-1]||{};
  const periods=fxRates.map(r=>r.period);
  const lastTwo=periods.slice(-2);
  const [cP1,setCP1]=useState(lastTwo[0]||periods[0]||"");
  const [cP2,setCP2]=useState(lastTwo[1]||periods[0]||"");
  const [fEntity,setFEntity]=useState("All");
  const [fStage,setFStage]=useState("All");
  const [fProduct,setFProduct]=useState("All");

  // Stage filter period: deals closing in or before selected periods
  const [closePeriod,setClosePeriod]=useState(periods[periods.length-1]||"");

  function toRM(amount,ccy){
    if(ccy===BASE)return amount;
    if(ccy==="USD")return amount*(spotRow.MYR||1);
    const r=spotRow[ccy];const m=spotRow.MYR;return(r&&m)?amount*(m/r):amount;
  }

  const allProducts=[...new Set(sales.map(d=>d.product))].filter(Boolean);

  // Filter deals
  const filtDeals=sales.filter(d=>{
    if(!gf.entityIds.includes(d.entityId))return false;
    if(fEntity!=="All"&&d.entityId!==fEntity)return false;
    if(fStage!=="All"&&d.stage!==fStage)return false;
    if(fProduct!=="All"&&d.product!==fProduct)return false;
    return true;
  });

  const activeE=entities.filter(e=>e.active&&gf.entityIds.includes(e.id));

  // Funnel data
  const funnelData=DEAL_STAGES.map(stage=>{
    const deals=filtDeals.filter(d=>d.stage===stage);
    const value=deals.reduce((s,d)=>s+toRM(d.value,d.currency),0);
    const weighted=deals.reduce((s,d)=>s+toRM(d.value,d.currency)*(STAGE_PROB[stage]/100),0);
    return{stage,count:deals.length,value,weighted,color:STAGE_CLR[stage]};
  });

  // KPIs
  const wonDeals=filtDeals.filter(d=>d.stage==="Won");
  const activeDeals=filtDeals.filter(d=>!["Won","Lost"].includes(d.stage));
  const totalWon=wonDeals.reduce((s,d)=>s+toRM(d.value,d.currency),0);
  const pipeline=activeDeals.reduce((s,d)=>s+toRM(d.value,d.currency),0);
  const weightedPipeline=activeDeals.reduce((s,d)=>s+toRM(d.value,d.currency)*(STAGE_PROB[d.stage]/100),0);
  const lostDeals=filtDeals.filter(d=>d.stage==="Lost");
  const winRate=wonDeals.length+lostDeals.length>0?(wonDeals.length/(wonDeals.length+lostDeals.length)*100):0;
  const avgDealSize=wonDeals.length>0?totalWon/wonDeals.length:0;

  // Forecast by close period
  const forecastData=periods.map(p=>{
    const mon=p;
    const closing=filtDeals.filter(d=>d.closeDate&&d.closeDate.slice(0,7)===periodToISOMon(p));
    const wonV=closing.filter(d=>d.stage==="Won").reduce((s,d)=>s+toRM(d.value,d.currency),0);
    const wgtV=closing.filter(d=>!["Won","Lost"].includes(d.stage)).reduce((s,d)=>s+toRM(d.value,d.currency)*(STAGE_PROB[d.stage]/100),0);
    return{period:p,won:wonV,forecast:wgtV,total:wonV+wgtV};
  }).filter(d=>d.won>0||d.forecast>0);

  function periodToISOMon(p){
    const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const parts=p.split(" ");
    if(parts.length!==2)return"";
    return parts[1]+"-"+String(months.indexOf(parts[0])+1).padStart(2,"0");
  }

  // Period compare — won revenue
  function wonByPeriod(p){
    const iso=periodToISOMon(p);
    return filtDeals.filter(d=>d.stage==="Won"&&d.closeDate?.startsWith(iso)).reduce((s,d)=>s+toRM(d.value,d.currency),0);
  }

  // Deal form
  const DBLANK={id:"",entityId:activeE[0]?.id||"",name:"",stage:"Lead",value:"",currency:"MYR",closeDate:"",owner:"",product:"",notes:""};
  const [dform,setDform]=useState(DBLANK);
  const [editing,setEditing]=useState(null);

  function saveDeal(){
    if(!dform.name||!dform.value)return;
    const deal={...dform,id:dform.id||"D"+Math.random().toString(36).slice(2,7).toUpperCase(),value:parseFloat(dform.value)||0};
    const updated=editing?sales.map(d=>d.id===editing?deal:d):[...sales,deal];
    const ns={...store,sales:updated};setStore(ns);persist(ns);
    setDform(DBLANK);setEditing(null);
  }
  function deleteDeal(id){const ns={...store,sales:sales.filter(d=>d.id!==id)};setStore(ns);persist(ns);}
  function startEdit(d){setDform({...d,value:String(d.value)});setEditing(d.id);}

  function handleUpload(rows){
    const hdrs=rows[0].map(h=>h.trim().toUpperCase());
    const col=k=>hdrs.findIndex(h=>h===k);
    const parsed=rows.slice(1).map(r=>({
      id:"D"+Math.random().toString(36).slice(2,7).toUpperCase(),
      entityId:r[col("ENTITYID")]||activeE[0]?.id||"",
      name:r[col("NAME")]||r[col("DEAL")]||"",
      stage:r[col("STAGE")]||"Lead",
      value:parseFloat(r[col("VALUE")])||0,
      currency:(r[col("CURRENCY")]||"MYR").toUpperCase(),
      closeDate:r[col("CLOSEDATE")]||r[col("CLOSE")]||"",
      owner:r[col("OWNER")]||"",
      product:r[col("PRODUCT")]||"",
      notes:r[col("NOTES")]||"",
    })).filter(r=>r.name&&r.value);
    const ns={...store,sales:[...sales,...parsed]};setStore(ns);persist(ns);
  }

  function dlTemplate(){
    const hdr="EntityId,Name,Stage,Value,Currency,CloseDate,Owner,Product,Notes\n";
    const ex=`${activeE[0]?.id||"E001"},Deal Name,Proposal,50000,MYR,2025-03-31,Owner Name,AI Solutions,Notes here`;
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([hdr+ex],{type:"text/csv"}));a.download="sales_template.csv";a.click();
  }

  const TABS=[{id:"pipeline",label:"Pipeline"},{id:"funnel",label:"Funnel"},{id:"forecast",label:"Forecast"},{id:"deals",label:"All Deals"},{id:"insights",label:"📊 Insights"},{id:"data",label:"Data"}];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Controls */}
      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",background:P.surf2,borderRadius:10,padding:"10px 14px",border:`1px solid ${P.border}`}}>
        <Sel value={fEntity} onChange={setFEntity} style={{width:170,fontSize:11}}>
          <option value="All">All Entities</option>
          {activeE.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
        </Sel>
        <Sel value={fStage} onChange={setFStage} style={{width:130,fontSize:11}}>
          <option value="All">All Stages</option>
          {DEAL_STAGES.map(s=><option key={s}>{s}</option>)}
        </Sel>
        <Sel value={fProduct} onChange={setFProduct} style={{width:140,fontSize:11}}>
          <option value="All">All Products</option>
          {allProducts.map(p=><option key={p}>{p}</option>)}
        </Sel>
        <div style={{marginLeft:"auto",fontSize:11,color:P.muted}}>{filtDeals.length} deals</div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        <KPI label="Won Revenue"       value={fmtK(totalWon)}          color={P.green}  accent={P.green}  small sub={`${wonDeals.length} deals`}/>
        <KPI label="Pipeline Value"    value={fmtK(pipeline)}          color={P.blue}   accent={P.blue}   small sub={`${activeDeals.length} active`}/>
        <KPI label="Weighted Forecast" value={fmtK(weightedPipeline)}  color={P.gold}   accent={P.gold}   small sub="probability adjusted"/>
        <KPI label="Win Rate"          value={winRate.toFixed(0)+"%"}  color={winRate>60?P.green:winRate>40?P.gold:P.red} small sub={`${wonDeals.length}W / ${lostDeals.length}L`}/>
        <KPI label="Avg Deal Size"     value={fmtK(avgDealSize)}       color={P.purple} small/>
        <KPI label="Total Deals"       value={filtDeals.length}        color={P.sub}    small sub={`${lostDeals.length} lost`}/>
      </div>

      <SubTabs tabs={TABS} active={tab} onChange={setTab}/>

      {/* PIPELINE */}
      {tab==="pipeline"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {DEAL_STAGES.filter(s=>s!=="Lost").map(stage=>{
            const deals=filtDeals.filter(d=>d.stage===stage);
            if(!deals.length&&stage==="Lead")return null;
            const stageVal=deals.reduce((s,d)=>s+toRM(d.value,d.currency),0);
            return(
              <div key={stage}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:STAGE_CLR[stage]}}/>
                  <span style={{color:STAGE_CLR[stage],fontWeight:700,fontSize:11,letterSpacing:1}}>{stage.toUpperCase()}</span>
                  <span style={{color:P.muted,fontSize:10}}>{deals.length} deals · {fmtK(stageVal)}</span>
                  <div style={{flex:1,height:1,background:P.border}}/>
                  <span style={{color:P.muted,fontSize:10}}>{STAGE_PROB[stage]}% probability</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:8}}>
                  {deals.map(d=>{
                    const e=entities.find(x=>x.id===d.entityId);
                    return(
                      <div key={d.id} style={{background:P.surf2,border:`1px solid ${STAGE_CLR[stage]}30`,borderRadius:10,padding:"11px 13px",cursor:"pointer"}} onClick={()=>startEdit(d)}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                          <div style={{color:P.text,fontWeight:600,fontSize:12,flex:1,paddingRight:8}}>{d.name}</div>
                          <div style={{color:STAGE_CLR[stage],fontFamily:"monospace",fontSize:12,fontWeight:700,flexShrink:0}}>{fmtAmt(d.value,d.currency)}</div>
                        </div>
                        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                          {e&&<div style={{display:"flex",alignItems:"center",gap:4}}><EntityDot entity={e} size={6}/><span style={{color:e.color,fontSize:10}}>{e.name}</span></div>}
                          {d.product&&<Badge label={d.product} color={P.purple}/>}
                          {d.closeDate&&<span style={{color:P.muted,fontSize:10}}>{d.closeDate}</span>}
                        </div>
                        {d.notes&&<div style={{color:P.muted,fontSize:10,marginTop:5,fontStyle:"italic"}}>{d.notes}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FUNNEL */}
      {tab==="funnel"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Card title="Funnel — Deal Count">
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {funnelData.map((s,i)=>{
                  const maxCount=Math.max(...funnelData.map(x=>x.count),1);
                  const w=Math.max(10,(s.count/maxCount)*100);
                  return(
                    <div key={s.stage} style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:90,color:s.color,fontSize:10,fontWeight:700,textAlign:"right",flexShrink:0}}>{s.stage}</div>
                      <div style={{flex:1,height:28,background:P.surf2,borderRadius:5,overflow:"hidden",position:"relative"}}>
                        <div style={{position:"absolute",left:0,top:0,height:"100%",width:w+"%",background:s.color,opacity:0.25,borderRadius:5}}/>
                        <div style={{position:"absolute",left:0,top:0,height:"100%",width:"3px",background:s.color,borderRadius:5}}/>
                        <div style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:P.text,fontSize:11,fontWeight:700}}>{s.count}</div>
                      </div>
                      <div style={{width:80,textAlign:"right",fontFamily:"monospace",color:P.muted,fontSize:10}}>{fmtK(s.value)}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card title="Funnel — Value (MYR)">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={funnelData.filter(d=>d.value>0)} layout="vertical" margin={{top:0,right:60,left:70,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                  <XAxis type="number" tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                  <YAxis dataKey="stage" type="category" tick={{fill:P.muted,fontSize:10}} width={70}/>
                  <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                  <Bar dataKey="value" name="Total Value" radius={[0,4,4,0]}>
                    {funnelData.filter(d=>d.value>0).map((d,i)=><Cell key={i} fill={d.color}/>)}
                  </Bar>
                  <Bar dataKey="weighted" name="Weighted" radius={[0,4,4,0]} opacity={0.5}>
                    {funnelData.filter(d=>d.value>0).map((d,i)=><Cell key={i} fill={d.color}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
          {/* Conversion rates */}
          <Card title="Stage Conversion Rates">
            <div style={{display:"flex",gap:0,alignItems:"center",flexWrap:"wrap"}}>
              {DEAL_STAGES.slice(0,-1).map((stage,i)=>{
                const curr=funnelData.find(d=>d.stage===stage)?.count||0;
                const next=funnelData.find(d=>d.stage===DEAL_STAGES[i+1])?.count||0;
                const rate=curr>0?((next/curr)*100).toFixed(0):0;
                return(
                  <div key={stage} style={{display:"flex",alignItems:"center"}}>
                    <div style={{textAlign:"center",padding:"8px 12px"}}>
                      <div style={{color:STAGE_CLR[stage],fontSize:10,fontWeight:700,marginBottom:3}}>{stage}</div>
                      <div style={{color:P.text,fontFamily:"monospace",fontSize:14,fontWeight:700}}>{curr}</div>
                    </div>
                    <div style={{textAlign:"center",padding:"0 6px"}}>
                      <div style={{color:P.muted,fontSize:9,marginBottom:2}}>{rate}%</div>
                      <div style={{color:P.muted,fontSize:12}}>→</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* FORECAST */}
      {tab==="forecast"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card title="Revenue Forecast — Won + Probability-Weighted Pipeline">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={forecastData} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="period" tick={{fill:P.muted,fontSize:10}}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Legend formatter={v=><span style={{color:P.muted,fontSize:11}}>{v}</span>}/>
                <Bar dataKey="won"      name="Won Revenue"  fill={P.green}         radius={[3,3,0,0]}/>
                <Bar dataKey="forecast" name="Weighted Fcst" fill={`${P.gold}70`}  radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Forecast Detail by Closing Period" noPad>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:P.surf2}}>{["Period","Deals Closing","Won","Weighted Fcst","Total"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:h==="Period"||h==="Deals Closing"?"left":"right",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1}}>{h}</th>)}</tr></thead>
                <tbody>
                  {forecastData.map((row,i)=>(
                    <tr key={row.period} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}12`}}>
                      <td style={{padding:"7px 10px",color:P.gold,fontWeight:600}}>{row.period}</td>
                      <td style={{padding:"7px 10px",color:P.muted,fontSize:10}}>
                        {filtDeals.filter(d=>d.closeDate?.startsWith(periodToISOMon(row.period))).map(d=><span key={d.id} style={{marginRight:6,color:STAGE_CLR[d.stage],fontSize:10}}>{d.name.split(" ").slice(0,2).join(" ")}…</span>)}
                      </td>
                      <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:P.green,fontWeight:700}}>{row.won?fmtMYR(row.won):"—"}</td>
                      <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:P.gold}}>{row.forecast?fmtMYR(row.forecast):"—"}</td>
                      <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:P.text,fontWeight:700}}>{fmtMYR(row.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          {/* Product breakdown */}
          <Card title="Pipeline by Product">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
              {allProducts.map(prod=>{
                const deals=filtDeals.filter(d=>d.product===prod&&!["Won","Lost"].includes(d.stage));
                const val=deals.reduce((s,d)=>s+toRM(d.value,d.currency),0);
                const wgt=deals.reduce((s,d)=>s+toRM(d.value,d.currency)*(STAGE_PROB[d.stage]/100),0);
                return(
                  <div key={prod} style={{background:P.surf2,border:`1px solid ${P.purple}30`,borderRadius:9,padding:"10px 12px"}}>
                    <div style={{color:P.purple,fontSize:10,fontWeight:700,marginBottom:6}}>{prod}</div>
                    <div style={{color:P.text,fontFamily:"monospace",fontSize:13,fontWeight:700}}>{fmtK(val)}</div>
                    <div style={{color:P.gold,fontSize:10,marginTop:2}}>Wtd: {fmtK(wgt)}</div>
                    <div style={{color:P.muted,fontSize:9,marginTop:2}}>{deals.length} deals</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ALL DEALS */}
      {tab==="deals"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {editing&&(
            <Card title="Edit Deal" accent={P.gold}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 120px 120px 120px 130px auto",gap:8,alignItems:"end"}}>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>DEAL NAME *</div><Input value={dform.name} onChange={v=>setDform(f=>({...f,name:v}))} placeholder="Deal name"/></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>ENTITY</div><Sel value={dform.entityId} onChange={v=>setDform(f=>({...f,entityId:v}))} style={{width:"100%"}}>{activeE.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</Sel></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>STAGE</div><Sel value={dform.stage} onChange={v=>setDform(f=>({...f,stage:v}))} style={{width:"100%"}}>{DEAL_STAGES.map(s=><option key={s}>{s}</option>)}</Sel></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>VALUE *</div><Input value={dform.value} onChange={v=>setDform(f=>({...f,value:v}))} type="number"/></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>CURRENCY</div><Sel value={dform.currency} onChange={v=>setDform(f=>({...f,currency:v}))} style={{width:"100%"}}>{CCY_LIST.map(c=><option key={c}>{c}</option>)}</Sel></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>CLOSE DATE</div><Input value={dform.closeDate} onChange={v=>setDform(f=>({...f,closeDate:v}))} type="date"/></div>
                <div style={{display:"flex",gap:6,paddingTop:16}}>
                  <Btn onClick={saveDeal} small>Save</Btn>
                  <Btn onClick={()=>{setDform(DBLANK);setEditing(null);}} small outline color={P.muted}>✕</Btn>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:8}}>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>PRODUCT</div><Input value={dform.product} onChange={v=>setDform(f=>({...f,product:v}))} placeholder="AI Solutions"/></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>OWNER</div><Input value={dform.owner} onChange={v=>setDform(f=>({...f,owner:v}))} placeholder="Owner"/></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>NOTES</div><Input value={dform.notes} onChange={v=>setDform(f=>({...f,notes:v}))} placeholder="Notes"/></div>
              </div>
            </Card>
          )}
          {!editing&&(
            <Card title="Add New Deal" accent={P.green}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 120px 120px 120px 130px auto",gap:8,alignItems:"end"}}>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>DEAL NAME *</div><Input value={dform.name} onChange={v=>setDform(f=>({...f,name:v}))} placeholder="Deal name"/></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>ENTITY</div><Sel value={dform.entityId} onChange={v=>setDform(f=>({...f,entityId:v}))} style={{width:"100%"}}>{activeE.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</Sel></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>STAGE</div><Sel value={dform.stage} onChange={v=>setDform(f=>({...f,stage:v}))} style={{width:"100%"}}>{DEAL_STAGES.map(s=><option key={s}>{s}</option>)}</Sel></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>VALUE *</div><Input value={dform.value} onChange={v=>setDform(f=>({...f,value:v}))} type="number"/></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>CURRENCY</div><Sel value={dform.currency} onChange={v=>setDform(f=>({...f,currency:v}))} style={{width:"100%"}}>{CCY_LIST.map(c=><option key={c}>{c}</option>)}</Sel></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>CLOSE DATE</div><Input value={dform.closeDate} onChange={v=>setDform(f=>({...f,closeDate:v}))} type="date"/></div>
                <div style={{paddingTop:16}}><Btn onClick={saveDeal} small>+ Add</Btn></div>
              </div>
            </Card>
          )}
          <Card noPad>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:P.surf2}}>{["Deal","Entity","Stage","Value","MYR Equiv.","Wtd Value","Close","Product",""].map(h=><th key={h} style={{textAlign:"left",padding:"7px 10px",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
                <tbody>
                  {filtDeals.map((d,i)=>{
                    const e=entities.find(x=>x.id===d.entityId);
                    const rm=toRM(d.value,d.currency);
                    const wgt=rm*(STAGE_PROB[d.stage]/100);
                    return(
                      <tr key={d.id} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}12`,opacity:d.stage==="Lost"?0.5:1}}>
                        <td style={{padding:"7px 10px",color:P.text,fontWeight:500,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</td>
                        <td style={{padding:"7px 10px"}}>{e&&<div style={{display:"flex",alignItems:"center",gap:5}}><EntityDot entity={e} size={6}/><span style={{color:e.color,fontSize:10}}>{e.name}</span></div>}</td>
                        <td style={{padding:"7px 10px"}}><Badge label={d.stage} color={STAGE_CLR[d.stage]}/></td>
                        <td style={{padding:"7px 10px",fontFamily:"monospace",color:P.text}}>{fmtAmt(d.value,d.currency)}</td>
                        <td style={{padding:"7px 10px",fontFamily:"monospace",color:P.gold,fontWeight:700}}>{fmtMYR(rm)}</td>
                        <td style={{padding:"7px 10px",fontFamily:"monospace",color:d.stage==="Won"?P.green:P.muted}}>{fmtMYR(wgt)}</td>
                        <td style={{padding:"7px 10px",fontFamily:"monospace",color:P.muted,fontSize:10}}>{d.closeDate||"—"}</td>
                        <td style={{padding:"7px 10px"}}>{d.product&&<Badge label={d.product} color={P.purple}/>}</td>
                        <td style={{padding:"7px 10px",display:"flex",gap:5}}>
                          <Btn onClick={()=>startEdit(d)} small outline color={P.gold}>Edit</Btn>
                          <Btn onClick={()=>deleteDeal(d.id)} small outline danger>✕</Btn>
                        </td>
                      </tr>
                    );
                  })}
                  {!filtDeals.length&&<tr><td colSpan={9} style={{padding:20,textAlign:"center",color:P.muted,fontSize:12}}>No deals. Add one above or upload via Data tab.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* INSIGHTS */}
      {tab==="insights"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <PeriodComparePicker periods={periods} p1={cP1} p2={cP2} onP1={setCP1} onP2={setCP2} label1="Period A" label2="Period B"/>
          <InsightPanel title="Won Revenue — Period Comparison">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
              {[[cP1,wonByPeriod(cP1)],[cP2,wonByPeriod(cP2)]].map(([p,v],i)=>(
                <div key={p} style={{background:P.surf3,border:`1px solid ${P.bord2}`,borderRadius:10,padding:"14px 16px"}}>
                  <div style={{color:P.gold,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:6}}>{p}</div>
                  <div style={{color:P.green,fontFamily:"monospace",fontSize:18,fontWeight:700}}>{fmtMYR(v)}</div>
                  {i===1&&<Delta current={v} previous={wonByPeriod(cP1)}/>}
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={forecastData} margin={{top:0,right:16,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="period" tick={{fill:P.muted,fontSize:9}}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Bar dataKey="won"      name="Won"      fill={P.green}        radius={[3,3,0,0]}>
                  {forecastData.map((d,i)=><Cell key={i} fill={d.period===cP1||d.period===cP2?P.gold:P.green}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </InsightPanel>
          <InsightPanel title="Win Rate & Deal Velocity by Entity">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
              {activeE.map(e=>{
                const eDeals=filtDeals.filter(d=>d.entityId===e.id);
                const eWon=eDeals.filter(d=>d.stage==="Won");
                const eLost=eDeals.filter(d=>d.stage==="Lost");
                const eWR=eWon.length+eLost.length>0?(eWon.length/(eWon.length+eLost.length)*100):0;
                const ePipeline=eDeals.filter(d=>!["Won","Lost"].includes(d.stage)).reduce((s,d)=>s+toRM(d.value,d.currency),0);
                return(
                  <div key={e.id} style={{background:P.surf2,border:`1px solid ${e.color}30`,borderRadius:9,padding:"10px 12px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><EntityDot entity={e} size={7}/><span style={{color:e.color,fontWeight:700,fontSize:11}}>{e.name}</span></div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                      <div><div style={{color:P.muted,fontSize:9}}>Win Rate</div><div style={{color:eWR>60?P.green:eWR>40?P.gold:P.red,fontFamily:"monospace",fontSize:13,fontWeight:700}}>{eWR.toFixed(0)}%</div></div>
                      <div><div style={{color:P.muted,fontSize:9}}>Pipeline</div><div style={{color:P.blue,fontFamily:"monospace",fontSize:12,fontWeight:700}}>{fmtK(ePipeline)}</div></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </InsightPanel>
          <InsightPanel title="Revenue by Product — Won Deals">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={allProducts.map(p=>({name:p,value:filtDeals.filter(d=>d.stage==="Won"&&d.product===p).reduce((s,d)=>s+toRM(d.value,d.currency),0)})).filter(d=>d.value>0)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                    {allProducts.map((_,i)=><Cell key={i} fill={[P.gold,P.blue,P.green,P.purple,P.orange,P.mag][i%6]}/>)}
                  </Pie>
                  <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                  <Legend formatter={v=><span style={{color:P.muted,fontSize:10}}>{v}</span>}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{display:"flex",flexDirection:"column",gap:8,justifyContent:"center"}}>
                {allProducts.map((p,i)=>{
                  const val=filtDeals.filter(d=>d.stage==="Won"&&d.product===p).reduce((s,d)=>s+toRM(d.value,d.currency),0);
                  const total=totalWon||1;
                  return val>0?(
                    <div key={p} style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:[P.gold,P.blue,P.green,P.purple,P.orange,P.mag][i%6],flexShrink:0}}/>
                      <span style={{color:P.sub,fontSize:11,flex:1}}>{p}</span>
                      <span style={{fontFamily:"monospace",color:P.gold,fontSize:11,fontWeight:700}}>{fmtMYR(val)}</span>
                      <span style={{color:P.muted,fontSize:10,width:36,textAlign:"right"}}>{((val/total)*100).toFixed(0)}%</span>
                    </div>
                  ):null;
                })}
              </div>
            </div>
          </InsightPanel>
        </div>
      )}

      {/* DATA */}
      {tab==="data"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card title="Upload Sales Data">
            <DropZone onRows={handleUpload} label="Drop sales file (.xlsx or .csv)"/>
            <div style={{marginTop:8,fontSize:10,color:P.muted}}>Columns: <span style={{color:P.gold}}>EntityId, Name, Stage, Value, Currency, CloseDate (YYYY-MM-DD), Owner, Product, Notes</span></div>
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <button onClick={dlTemplate} style={{background:"transparent",border:`1px solid ${P.border}`,borderRadius:6,color:P.muted,fontSize:10,padding:"4px 10px",cursor:"pointer",fontFamily:"inherit"}}>↓ Template CSV</button>
              <Btn onClick={()=>{const ns={...store,sales:DEFAULT_SALES};setStore(ns);persist(ns);}} small outline color={P.blue}>Reset to Sample Data</Btn>
            </div>
          </Card>
          <Card title="Current Data Summary">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10}}>
              {DEAL_STAGES.map(s=>{const c=sales.filter(d=>d.stage===s).length;return c>0?(<div key={s} style={{background:P.surf2,borderRadius:8,padding:"8px 12px",border:`1px solid ${STAGE_CLR[s]}30`}}><div style={{color:STAGE_CLR[s],fontSize:9,fontWeight:700,marginBottom:3}}>{s}</div><div style={{color:P.text,fontSize:15,fontWeight:700}}>{c}</div></div>):null;})}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MODULE: P&L  (auto-linked from GL class R + X accounts)
// ══════════════════════════════════════════════════════════════════
function PLModule({gf}){
  const {store}=useStore();
  const {gl,coa,entities,fxRates,budget}=store;
  const periods=fxRates.map(r=>r.period);
  const lastTwo=periods.slice(-2);
  const [cP1,setCP1]=useState(lastTwo[0]||periods[0]||"");
  const [cP2,setCP2]=useState(lastTwo[1]||periods[0]||"");
  const [viewMode,setViewMode]=useState("period"); // period | ytd
  const [tab,setTab]=useState("statement");
  const [plOpen,setPlOpen]=useState({R:true,COGS:true,NonOp:true,DC:true,SR:true,IDC:true});
  const togPL=id=>setPlOpen(p=>({...p,[id]:!p[id]}));

  const activeE=entities.filter(e=>e.active&&gf.entityIds.includes(e.id));

  // Get GL net for account code across entities and periods (returns MYR)
  function getGL(accountCode,forPeriods,entityIds){
    let dr=0,cr=0;
    entityIds.forEach(eid=>{
      const e=entities.find(x=>x.id===eid);
      const ccy=e?.currency||BASE;
      gl.filter(j=>j.entityId===eid&&forPeriods.includes(j.period)).forEach(j=>{
        const rates=forPeriods.map(p=>getFxRate(fxRates,p,ccy));
        const avgR=rates.length?rates.reduce((a,b)=>a+b,0)/rates.length:1;
        const acct=coa.find(a=>a.code===j.drAccount||a.code===j.crAccount);
        // Use account fx method
        const acctDr=coa.find(a=>a.code===j.drAccount);
        const acctCr=coa.find(a=>a.code===j.crAccount);
        const rate=(acctDr?.fxMethod==="average"||acctCr?.fxMethod==="average")?avgR:getFxRate(fxRates,forPeriods[forPeriods.length-1],ccy);
        if(j.drAccount===accountCode) dr+=j.amount*rate;
        if(j.crAccount===accountCode) cr+=j.amount*rate;
      });
    });
    return{dr,cr,net:dr-cr};
  }

  function buildPL(forPeriods,entityIds){
    const rows=[];
    let totalRev=0,totalCOGS=0,totalExp=0;
    // Revenue (class R, not Non-Operating)
    coa.filter(a=>a.class==="R"&&a.active&&a.group!=="Non-Operating").forEach(a=>{
      const{dr,cr}=getGL(a.code,forPeriods,entityIds);
      const val=cr-dr;
      if(Math.abs(val)>0.01){rows.push({type:"R",code:a.code,name:a.name,group:a.group,value:val,isIC:a.icEligible});totalRev+=val;}
    });
    // Non-operating income
    coa.filter(a=>a.class==="R"&&a.active&&a.group==="Non-Operating").forEach(a=>{
      const{dr,cr}=getGL(a.code,forPeriods,entityIds);
      const val=cr-dr;
      if(Math.abs(val)>0.01){rows.push({type:"NonOp",code:a.code,name:a.name,group:a.group,value:val,isIC:a.icEligible});}
    });
    // COGS
    coa.filter(a=>a.class==="X"&&a.active&&a.group==="Cost of Sales").forEach(a=>{
      const{dr,cr}=getGL(a.code,forPeriods,entityIds);
      const val=dr-cr;
      if(Math.abs(val)>0.01){rows.push({type:"COGS",code:a.code,name:a.name,group:a.group,value:val,isIC:a.icEligible});totalCOGS+=val;}
    });
    const grossProfit=totalRev-totalCOGS;
    // Direct Cost
    coa.filter(a=>a.class==="X"&&a.active&&a.group==="Direct Cost").forEach(a=>{
      const{dr,cr}=getGL(a.code,forPeriods,entityIds);
      const val=dr-cr;
      if(Math.abs(val)>0.01){rows.push({type:"DC",code:a.code,name:a.name,group:a.group,value:val,isIC:a.icEligible});totalExp+=val;}
    });
    // Staff Reward
    coa.filter(a=>a.class==="X"&&a.active&&a.group==="Staff Reward").forEach(a=>{
      const{dr,cr}=getGL(a.code,forPeriods,entityIds);
      const val=dr-cr;
      if(Math.abs(val)>0.01){rows.push({type:"SR",code:a.code,name:a.name,group:a.group,value:val,isIC:a.icEligible});totalExp+=val;}
    });
    // Indirect Cost / other opex
    coa.filter(a=>a.class==="X"&&a.active&&!["Cost of Sales","Direct Cost","Staff Reward"].includes(a.group)).forEach(a=>{
      const{dr,cr}=getGL(a.code,forPeriods,entityIds);
      const val=dr-cr;
      if(Math.abs(val)>0.01){rows.push({type:"IDC",code:a.code,name:a.name,group:a.group,value:val,isIC:a.icEligible});totalExp+=val;}
    });
    const netProfit=grossProfit-totalExp;
    return{rows,totalRev,totalCOGS,grossProfit,totalExp,ebitda:netProfit,netProfit};
  }

  const ytdPeriods=useMemo(()=>{const idx=periods.indexOf(cP2);return idx>=0?periods.slice(0,idx+1):[];}, [periods,cP2]);
  const forPeriods=viewMode==="ytd"?ytdPeriods:[cP2];
  const forPeriodsP1=viewMode==="ytd"?periods.slice(0,Math.max(0,periods.indexOf(cP1)+1)):[cP1];
  const entityIds=activeE.map(e=>e.id);

  const pl2=useMemo(()=>buildPL(forPeriods,entityIds),[gl,coa,fxRates,forPeriods,entityIds]);
  const pl1=useMemo(()=>buildPL(forPeriodsP1,entityIds),[gl,coa,fxRates,forPeriodsP1,entityIds]);

  // Budget comparison
  const getBudget=(accountCode,pds,eids)=>budget.filter(b=>eids.includes(b.entityId)&&pds.includes(b.period)&&b.accountCode===accountCode).reduce((s,b)=>s+b.budgetMYR,0);
  const budgetRev=coa.filter(a=>a.class==="R"&&a.active).reduce((s,a)=>s+getBudget(a.code,forPeriods,entityIds),0);
  const budgetExp=coa.filter(a=>a.class==="X"&&a.active).reduce((s,a)=>s+getBudget(a.code,forPeriods,entityIds),0);

  // Trend data over all periods
  const trendData=periods.map(p=>{
    const t=buildPL([p],entityIds);
    return{period:p,revenue:t.totalRev,grossProfit:t.grossProfit,netProfit:t.netProfit,expenses:t.totalExp};
  });

  const gpMargin=pl2.totalRev>0?(pl2.grossProfit/pl2.totalRev*100):0;
  const npMargin=pl2.totalRev>0?(pl2.netProfit/pl2.totalRev*100):0;

  function PLRow({label,value,prevVal,bold,indent,color,sub}){
    const chg=prevVal!=null&&prevVal!==0?((value-prevVal)/Math.abs(prevVal)*100):null;
    return(
      <tr>
        <td style={{padding:"6px 10px",color:bold?P.text:P.sub,fontSize:11,paddingLeft:indent?24:10,fontWeight:bold?700:400}}>{label}{sub&&<span style={{color:P.muted,fontSize:9,marginLeft:6}}>{sub}</span>}</td>
        <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:color||(value>=0?P.text:P.orange),fontWeight:bold?700:400,fontSize:11}}>{fmtMYR(value)}</td>
        <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:color||(pl1?P.sub:P.muted),fontSize:11}}>{prevVal!=null?fmtMYR(prevVal):"—"}</td>
        <td style={{padding:"6px 10px",textAlign:"right",fontSize:10}}>
          {chg!=null&&<span style={{color:chg>=0?P.green:P.red,fontWeight:600}}>{chg>=0?"▲":"▼"}{Math.abs(chg).toFixed(1)}%</span>}
        </td>
        <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.muted,fontSize:10}}>{pl2.totalRev>0?((Math.abs(value)/pl2.totalRev)*100).toFixed(1)+"%":"—"}</td>
      </tr>
    );
  }
  function PLHead({label,color,open,onToggle}){
    return(<tr onClick={onToggle} style={{cursor:onToggle?"pointer":"default",userSelect:"none"}}>
      <td colSpan={5} style={{padding:"10px 10px 5px",color:color||P.gold,fontSize:10,fontWeight:700,letterSpacing:1,background:P.surf2,borderTop:`1px solid ${P.border}`}}>
        {onToggle&&<span style={{marginRight:6,fontSize:12,display:"inline-block",width:14}}>{open?"∨":"›"}</span>}{label}
      </td></tr>);
  }
  function PLTotal({label,value,prevVal,color}){
    const chg=prevVal!=null&&prevVal!==0?((value-prevVal)/Math.abs(prevVal)*100):null;
    return(
      <tr style={{borderTop:`2px solid ${color||P.gold}`,background:P.surf3}}>
        <td style={{padding:"10px",color:color||P.gold,fontWeight:700,fontSize:12}}>{label}</td>
        <td style={{padding:"10px",fontFamily:"monospace",textAlign:"right",color:color||P.gold,fontWeight:700,fontSize:13}}>{fmtMYR(value)}</td>
        <td style={{padding:"10px",fontFamily:"monospace",textAlign:"right",color:P.sub,fontSize:12}}>{prevVal!=null?fmtMYR(prevVal):"—"}</td>
        <td style={{padding:"10px",textAlign:"right",fontSize:10}}>{chg!=null&&<span style={{color:chg>=0?P.green:P.red,fontWeight:600}}>{chg>=0?"▲":"▼"}{Math.abs(chg).toFixed(1)}%</span>}</td>
        <td style={{padding:"10px",fontFamily:"monospace",textAlign:"right",color:P.muted,fontSize:10}}>{pl2.totalRev>0?((Math.abs(value)/pl2.totalRev)*100).toFixed(1)+"%":"—"}</td>
      </tr>
    );
  }

  const TABS=[{id:"statement",label:"P&L Statement"},{id:"trend",label:"Trend"},{id:"compare",label:"Period Compare"},{id:"insights",label:"📊 Insights"}];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Period controls */}
      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",background:P.surf2,borderRadius:10,padding:"10px 14px",border:`1px solid ${P.border}`}}>
        <PeriodComparePicker periods={periods} p1={cP1} p2={cP2} onP1={setCP1} onP2={setCP2} label1="Prior" label2="Current"/>
        <div style={{display:"flex",gap:3,background:P.bg2,borderRadius:7,padding:3,border:`1px solid ${P.border}`}}>
          {["period","ytd"].map(m=><button key={m} onClick={()=>setViewMode(m)} style={{padding:"4px 12px",borderRadius:5,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:600,background:viewMode===m?P.gold:"transparent",color:viewMode===m?"#0B0F1A":P.muted}}>{m==="period"?"Period":"YTD"}</button>)}
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:12,fontSize:11,color:P.muted}}>
          <span>GP Margin: <span style={{color:gpMargin>30?P.green:gpMargin>15?P.gold:P.red,fontWeight:700}}>{gpMargin.toFixed(1)}%</span></span>
          <span>NP Margin: <span style={{color:npMargin>10?P.green:npMargin>0?P.gold:P.red,fontWeight:700}}>{npMargin.toFixed(1)}%</span></span>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        <KPI label="Revenue"       value={fmtK(pl2.totalRev)}   color={P.green}                    accent={P.green}  small sub={pl1?<Delta current={pl2.totalRev} previous={pl1.totalRev}/>:null}/>
        <KPI label="Gross Profit"  value={fmtK(pl2.grossProfit)} color={P.blue}                    accent={P.blue}   small sub={gpMargin.toFixed(1)+"%"}/>
        <KPI label="Total OpEx"    value={fmtK(pl2.totalExp)}    color={P.orange}                  accent={P.orange} small/>
        <KPI label="Net Profit"    value={fmtK(pl2.netProfit)}   color={pl2.netProfit>=0?P.green:P.red} accent={pl2.netProfit>=0?P.green:P.red} small sub={npMargin.toFixed(1)+"%"}/>
        <KPI label="vs Budget Rev" value={budgetRev?fmtK(pl2.totalRev-budgetRev):"—"} color={pl2.totalRev>=budgetRev?P.green:P.red} small/>
        <KPI label="vs Budget Exp" value={budgetExp?fmtK(budgetExp-pl2.totalExp):"—"} color={pl2.totalExp<=budgetExp?P.green:P.red} small sub="savings vs budget"/>
      </div>

      <SubTabs tabs={TABS} active={tab} onChange={setTab}/>

      {tab==="statement"&&(
        <Card noPad title={`P&L — ${viewMode==="ytd"?"YTD to":""} ${cP2} vs ${cP1} · ${activeE.length} entities · MYR`}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:P.surf2}}>
                {["Account","Current"+( viewMode==="ytd"?" YTD":""),"Prior"+( viewMode==="ytd"?" YTD":""),"Change","% of Rev"].map(h=>(
                  <th key={h} style={{textAlign:h==="Account"?"left":"right",padding:"8px 10px",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                <PLHead label="Revenue" color={P.green} open={plOpen.R} onToggle={()=>togPL("R")}/>
                {plOpen.R&&pl2.rows.filter(r=>r.type==="R").map(r=>(
                  <PLRow key={r.code} label={r.name} value={r.value} prevVal={pl1.rows.find(x=>x.code===r.code)?.value} indent sub={r.isIC?"(IC)":null}/>
                ))}
                <PLTotal label="TOTAL REVENUE" value={pl2.totalRev} prevVal={pl1.totalRev} color={P.green}/>
                <PLHead label="Cost of Sales" color={P.orange} open={plOpen.COGS} onToggle={()=>togPL("COGS")}/>
                {plOpen.COGS&&pl2.rows.filter(r=>r.type==="COGS").map(r=>(
                  <PLRow key={r.code} label={r.name} value={r.value} prevVal={pl1.rows.find(x=>x.code===r.code)?.value} indent/>
                ))}
                <PLTotal label="Gross Profit" value={pl2.grossProfit} prevVal={pl1.grossProfit} color={P.blue}/>
                <tr><td colSpan={5} style={{padding:"4px 10px 8px",color:P.muted,fontSize:11,background:P.surf2}}>GP %&nbsp;&nbsp;<span style={{fontFamily:"monospace",color:P.gold}}>{pl2.totalRev>0?((pl2.grossProfit/pl2.totalRev)*100).toFixed(1)+"%":"—"}</span></td></tr>
                <PLHead label="Total Non Operating Income/(Expenses)" color={P.sub} open={plOpen.NonOp} onToggle={()=>togPL("NonOp")}/>
                {plOpen.NonOp&&pl2.rows.filter(r=>r.type==="NonOp").map(r=>(
                  <PLRow key={r.code} label={r.name} value={r.value} prevVal={pl1.rows.find(x=>x.code===r.code)?.value} indent/>
                ))}
                <PLHead label="Total Direct Cost (DC)" color={P.red} open={plOpen.DC} onToggle={()=>togPL("DC")}/>
                {plOpen.DC&&pl2.rows.filter(r=>r.type==="DC").map(r=>(
                  <PLRow key={r.code} label={r.name} value={r.value} prevVal={pl1.rows.find(x=>x.code===r.code)?.value} indent/>
                ))}
                <PLTotal label="TOTAL DIRECT COST" value={pl2.rows.filter(r=>r.type==="DC").reduce((s,r)=>s+r.value,0)} prevVal={pl1.rows.filter(r=>r.type==="DC").reduce((s,r)=>s+r.value,0)} color={P.red}/>
                <PLHead label="Total Staff Reward" color={P.purple} open={plOpen.SR} onToggle={()=>togPL("SR")}/>
                {plOpen.SR&&pl2.rows.filter(r=>r.type==="SR").map(r=>(
                  <PLRow key={r.code} label={r.name} value={r.value} prevVal={pl1.rows.find(x=>x.code===r.code)?.value} indent/>
                ))}
                <PLTotal label="TOTAL STAFF REWARD" value={pl2.rows.filter(r=>r.type==="SR").reduce((s,r)=>s+r.value,0)} prevVal={pl1.rows.filter(r=>r.type==="SR").reduce((s,r)=>s+r.value,0)} color={P.purple}/>
                <PLHead label="Total Indirect Cost (IDC)" color={P.orange} open={plOpen.IDC} onToggle={()=>togPL("IDC")}/>
                {plOpen.IDC&&pl2.rows.filter(r=>r.type==="IDC").map(r=>(
                  <PLRow key={r.code} label={r.name} value={r.value} prevVal={pl1.rows.find(x=>x.code===r.code)?.value} indent sub={r.isIC?"(IC)":null}/>
                ))}
                <PLTotal label="TOTAL OPEX" value={pl2.totalExp} prevVal={pl1.totalExp} color={P.orange}/>
                <PLTotal label="NET PROFIT / (LOSS)" value={pl2.netProfit} prevVal={pl1.netProfit} color={pl2.netProfit>=0?P.green:P.red}/>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab==="trend"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card title="Revenue, Gross Profit & Net Profit — All Periods">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="period" tick={{fill:P.muted,fontSize:10}}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Legend formatter={v=><span style={{color:P.muted,fontSize:11}}>{v}</span>}/>
                <Line type="monotone" dataKey="revenue"     name="Revenue"      stroke={P.green}  strokeWidth={2} dot={{r:3}}/>
                <Line type="monotone" dataKey="grossProfit" name="Gross Profit" stroke={P.blue}   strokeWidth={2} dot={{r:3}}/>
                <Line type="monotone" dataKey="netProfit"   name="Net Profit"   stroke={P.gold}   strokeWidth={2} dot={{r:3}}/>
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Expense Structure — Period Trend">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trendData} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="period" tick={{fill:P.muted,fontSize:10}}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Bar dataKey="expenses" name="Expenses" fill={P.red}  radius={[3,3,0,0]}/>
                <Bar dataKey="revenue"  name="Revenue"  fill={`${P.green}50`} radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {tab==="compare"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card title={`${cP1} vs ${cP2} — Side by Side`}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {[[cP1,pl1],[cP2,pl2]].map(([p,pl])=>(
                <div key={p}>
                  <div style={{color:P.gold,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:10,padding:"6px 10px",background:P.surf2,borderRadius:8}}>{p}</div>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <tbody>
                      {[["Revenue",pl.totalRev,P.green],["Gross Profit",pl.grossProfit,P.blue],["Total OpEx",pl.totalExp,P.orange],["Net Profit",pl.netProfit,pl.netProfit>=0?P.green:P.red]].map(([label,val,color])=>(
                        <tr key={label} style={{borderBottom:`1px solid ${P.border}20`}}>
                          <td style={{padding:"8px 10px",color:P.sub,fontSize:11}}>{label}</td>
                          <td style={{padding:"8px 10px",fontFamily:"monospace",textAlign:"right",color,fontWeight:700,fontSize:12}}>{fmtMYR(val)}</td>
                        </tr>
                      ))}
                      {[["GP Margin",(pl.totalRev>0?(pl.grossProfit/pl.totalRev*100):0).toFixed(1)+"%"],["NP Margin",(pl.totalRev>0?(pl.netProfit/pl.totalRev*100):0).toFixed(1)+"%"]].map(([label,val])=>(
                        <tr key={label} style={{borderBottom:`1px solid ${P.border}20`}}>
                          <td style={{padding:"6px 10px",color:P.muted,fontSize:10}}>{label}</td>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.gold,fontSize:11}}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Variance — Current vs Prior">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                {metric:"Revenue",    variance:pl2.totalRev-pl1.totalRev},
                {metric:"Gross Profit",variance:pl2.grossProfit-pl1.grossProfit},
                {metric:"OpEx",       variance:pl2.totalExp-pl1.totalExp},
                {metric:"Net Profit", variance:pl2.netProfit-pl1.netProfit},
              ]} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="metric" tick={{fill:P.muted,fontSize:10}}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                <ReferenceLine y={0} stroke={P.muted}/>
                <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Bar dataKey="variance" name="Variance" radius={[4,4,0,0]}>
                  {[0,1,2,3].map(i=><Cell key={i} fill={[P.green,P.blue,P.orange,P.gold][i]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          {/* By entity */}
          <Card title="Net Profit by Entity — Current Period">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
              {activeE.map(e=>{
                const ePL=buildPL(forPeriods,[e.id]);
                return(
                  <div key={e.id} style={{background:P.surf2,border:`1px solid ${e.color}30`,borderRadius:9,padding:"10px 12px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><EntityDot entity={e} size={7}/><span style={{color:e.color,fontWeight:700,fontSize:11}}>{e.name}</span></div>
                    <div><div style={{color:P.muted,fontSize:9}}>Revenue</div><div style={{color:P.green,fontFamily:"monospace",fontSize:13,fontWeight:700}}>{fmtK(ePL.totalRev)}</div></div>
                    <div style={{marginTop:6}}><div style={{color:P.muted,fontSize:9}}>Net Profit</div><div style={{color:ePL.netProfit>=0?P.green:P.red,fontFamily:"monospace",fontSize:13,fontWeight:700}}>{fmtK(ePL.netProfit)}</div></div>
                    <div style={{color:P.muted,fontSize:9,marginTop:4}}>{ePL.totalRev>0?((ePL.netProfit/ePL.totalRev)*100).toFixed(1)+"% margin":""}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {tab==="insights"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <InsightPanel title="Revenue vs Budget — Trend">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={periods.map(p=>{
                const pPL=buildPL([p],entityIds);
                const pBud=coa.filter(a=>a.class==="R"&&a.active).reduce((s,a)=>s+getBudget(a.code,[p],entityIds),0);
                return{period:p,revenue:pPL.totalRev,budget:pBud};
              }).filter(d=>d.revenue>0||d.budget>0)} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="period" tick={{fill:P.muted,fontSize:10}}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Legend formatter={v=><span style={{color:P.muted,fontSize:11}}>{v}</span>}/>
                <Bar dataKey="budget"  name="Budget"  fill={`${P.surf3}`} stroke={P.blue}  strokeWidth={1} radius={[3,3,0,0]}/>
                <Bar dataKey="revenue" name="Actual"  fill={P.green}                                        radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </InsightPanel>
          <InsightPanel title="Margin Trend — GP% and NP%">
            <div style={{fontSize:10,color:P.muted,marginBottom:8}}>Tracking gross and net margin over time. Widening gap = rising overhead.</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData.map(d=>({...d,gpMargin:d.revenue>0?(d.grossProfit/d.revenue*100):0,npMargin:d.revenue>0?(d.netProfit/d.revenue*100):0}))} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="period" tick={{fill:P.muted,fontSize:10}}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>v.toFixed(0)+"%"}/>
                <ReferenceLine y={0} stroke={P.muted} strokeDasharray="4 4"/>
                <Tooltip formatter={v=>v.toFixed(1)+"%"} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Legend formatter={v=><span style={{color:P.muted,fontSize:11}}>{v}</span>}/>
                <Line type="monotone" dataKey="gpMargin" name="GP Margin %" stroke={P.blue}  strokeWidth={2} dot={{r:3}}/>
                <Line type="monotone" dataKey="npMargin" name="NP Margin %" stroke={P.gold}  strokeWidth={2} dot={{r:3}}/>
              </LineChart>
            </ResponsiveContainer>
          </InsightPanel>
          <InsightPanel title="Revenue Mix — IC vs External">
            {(()=>{
              const extRev=pl2.rows.filter(r=>r.type==="R"&&!r.isIC).reduce((s,r)=>s+r.value,0);
              const icRev=pl2.rows.filter(r=>r.type==="R"&&r.isIC).reduce((s,r)=>s+r.value,0);
              return(
                <div style={{display:"flex",gap:16,alignItems:"center"}}>
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart><Pie data={[{name:"External",value:extRev},{name:"IC Revenue",value:icRev}].filter(d=>d.value>0)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                      <Cell fill={P.green}/><Cell fill={P.gold}/>
                    </Pie><Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/></PieChart>
                  </ResponsiveContainer>
                  <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
                    {[["External",extRev,P.green],["IC Revenue",icRev,P.gold]].map(([label,val,color])=>(
                      <div key={label} style={{display:"flex",gap:8,alignItems:"center"}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:color,flexShrink:0}}/>
                        <span style={{color:P.sub,fontSize:12,flex:1}}>{label}</span>
                        <span style={{fontFamily:"monospace",color,fontWeight:700,fontSize:12}}>{fmtMYR(val)}</span>
                        <span style={{color:P.muted,fontSize:10}}>{pl2.totalRev>0?((val/pl2.totalRev)*100).toFixed(0):0}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </InsightPanel>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MODULE: BALANCE SHEET
// ══════════════════════════════════════════════════════════════════
function BSModule({gf}){
  const {store}=useStore();
  const {gl,coa,entities,fxRates}=store;
  const periods=fxRates.map(r=>r.period);
  const lastTwo=periods.slice(-2);
  const [cP1,setCP1]=useState(lastTwo[0]||periods[0]||"");
  const [cP2,setCP2]=useState(lastTwo[1]||periods[0]||"");
  const [tab,setTab]=useState("statement");
  const [bsOpen,setBsOpen]=useState({A:true,L:true,E:true});
  const togBS=id=>setBsOpen(p=>({...p,[id]:!p[id]}));
  const activeE=entities.filter(e=>e.active&&gf.entityIds.includes(e.id));
  const entityIds=activeE.map(e=>e.id);

  // Get cumulative GL balance for BS account up to a period (YTD cumulative)
  function getBalance(accountCode,upToPeriod,eids){
    const allPeriods=periods.filter(p=>p<=upToPeriod);
    let dr=0,cr=0;
    eids.forEach(eid=>{
      const e=entities.find(x=>x.id===eid);
      const ccy=e?.currency||BASE;
      const closingRate=getFxRate(fxRates,upToPeriod,ccy);
      gl.filter(j=>j.entityId===eid&&allPeriods.includes(j.period)).forEach(j=>{
        if(j.drAccount===accountCode) dr+=j.amount*closingRate;
        if(j.crAccount===accountCode) cr+=j.amount*closingRate;
      });
    });
    return{dr,cr,net:dr-cr};
  }

  // Get net profit (P&L) up to period — feeds into retained earnings
  function getPLNetProfit(upToPeriod,eids){
    const allPeriods=periods.filter(p=>p<=upToPeriod);
    let rev=0,exp=0;
    eids.forEach(eid=>{
      const e=entities.find(x=>x.id===eid);
      const ccy=e?.currency||BASE;
      const avgRate=allPeriods.length?allPeriods.reduce((s,p)=>s+getFxRate(fxRates,p,ccy),0)/allPeriods.length:1;
      gl.filter(j=>j.entityId===eid&&allPeriods.includes(j.period)).forEach(j=>{
        const acctDr=coa.find(a=>a.code===j.drAccount);
        const acctCr=coa.find(a=>a.code===j.crAccount);
        if(acctCr?.class==="R") rev+=j.amount*avgRate;
        if(acctDr?.class==="R") rev-=j.amount*avgRate;
        if(acctDr?.class==="X") exp+=j.amount*avgRate;
        if(acctCr?.class==="X") exp-=j.amount*avgRate;
      });
    });
    return rev-exp;
  }

  function buildBS(upToPeriod,eids){
    const bsClasses=["A","L","E"];
    const sections={};
    let totalAssets=0,totalLiab=0,totalEquity=0;

    bsClasses.forEach(cls=>{
      const accts=coa.filter(a=>a.class===cls&&a.active);
      sections[cls]=accts.map(acct=>{
        const{dr,cr,net}=getBalance(acct.code,upToPeriod,eids);
        // Assets: debit-normal (net positive = asset)
        // Liabilities/Equity: credit-normal (net negative = liability/equity because cr > dr)
        const displayVal=cls==="A"?net:-net;
        return{code:acct.code,name:acct.name,group:acct.group,value:displayVal,isIC:acct.icEligible};
      }).filter(r=>Math.abs(r.value)>0.01);

      if(cls==="A") totalAssets=sections[cls].reduce((s,r)=>s+r.value,0);
      if(cls==="L") totalLiab=sections[cls].reduce((s,r)=>s+r.value,0);
      if(cls==="E") totalEquity=sections[cls].reduce((s,r)=>s+r.value,0);
    });

    // Auto-inject current period net profit into retained earnings
    const currentNP=getPLNetProfit(upToPeriod,eids);
    totalEquity+=currentNP;

    const balanced=Math.abs(totalAssets-(totalLiab+totalEquity+currentNP))<1;
    return{sections,totalAssets,totalLiab,totalEquity,currentNP,balanced};
  }

  const bs2=useMemo(()=>buildBS(cP2,entityIds),[gl,coa,fxRates,cP2,entityIds]);
  const bs1=useMemo(()=>buildBS(cP1,entityIds),[gl,coa,fxRates,cP1,entityIds]);

  const debtRatio=bs2.totalAssets>0?(bs2.totalLiab/bs2.totalAssets*100):0;
  const equityRatio=bs2.totalAssets>0?((bs2.totalEquity+bs2.currentNP)/bs2.totalAssets*100):0;
  const workingCapital=(bs2.sections["A"]||[]).filter(r=>["Current Assets"].includes(r.group)).reduce((s,r)=>s+r.value,0)
    -(bs2.sections["L"]||[]).filter(r=>["Current Liabilities"].includes(r.group)).reduce((s,r)=>s+r.value,0);

  function BSRow({label,value,prevVal,indent,bold,color,sub}){
    const chg=prevVal!=null&&prevVal!==0?((value-prevVal)/Math.abs(prevVal)*100):null;
    return(
      <tr>
        <td style={{padding:"6px 10px",color:bold?P.text:P.sub,fontSize:11,paddingLeft:indent?24:10,fontWeight:bold?700:400}}>{label}{sub&&<span style={{color:P.muted,fontSize:9,marginLeft:6}}>{sub}</span>}</td>
        <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:color||(value>=0?P.text:P.orange),fontWeight:bold?700:400,fontSize:11}}>{fmtMYR(value)}</td>
        <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.sub,fontSize:11}}>{prevVal!=null?fmtMYR(prevVal):"—"}</td>
        <td style={{padding:"6px 10px",textAlign:"right",fontSize:10}}>{chg!=null&&<span style={{color:chg>=0?P.green:P.red,fontWeight:600}}>{chg>=0?"▲":"▼"}{Math.abs(chg).toFixed(1)}%</span>}</td>
      </tr>
    );
  }
  function BSHead({label,color,open,onToggle}){
    return(<tr onClick={onToggle} style={{cursor:onToggle?"pointer":"default",userSelect:"none"}}>
      <td colSpan={4} style={{padding:"10px 10px 5px",color:color||P.gold,fontSize:10,fontWeight:700,letterSpacing:1,background:P.surf2,borderTop:`1px solid ${P.border}`}}>
        {onToggle&&<span style={{marginRight:6,fontSize:12,display:"inline-block",width:14}}>{open?"∨":"›"}</span>}{label}
      </td></tr>);
  }
  function BSTotal({label,value,prevVal,color}){
    const chg=prevVal!=null&&prevVal!==0?((value-prevVal)/Math.abs(prevVal)*100):null;
    return(
      <tr style={{borderTop:`2px solid ${color||P.gold}`,background:P.surf3}}>
        <td style={{padding:"10px",color:color||P.gold,fontWeight:700,fontSize:12}}>{label}</td>
        <td style={{padding:"10px",fontFamily:"monospace",textAlign:"right",color:color||P.gold,fontWeight:700,fontSize:13}}>{fmtMYR(value)}</td>
        <td style={{padding:"10px",fontFamily:"monospace",textAlign:"right",color:P.sub,fontSize:12}}>{prevVal!=null?fmtMYR(prevVal):"—"}</td>
        <td style={{padding:"10px",textAlign:"right",fontSize:10}}>{chg!=null&&<span style={{color:chg>=0?P.green:P.red,fontWeight:600}}>{chg>=0?"▲":"▼"}{Math.abs(chg).toFixed(1)}%</span>}</td>
      </tr>
    );
  }

  // Trend data
  const trendData=periods.map(p=>{
    const t=buildBS(p,entityIds);
    return{period:p,assets:t.totalAssets,liabilities:t.totalLiab,equity:t.totalEquity+t.currentNP};
  });

  const TABS=[{id:"statement",label:"Balance Sheet"},{id:"trend",label:"Trend"},{id:"compare",label:"Period Compare"},{id:"insights",label:"📊 Insights"}];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Period controls */}
      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",background:P.surf2,borderRadius:10,padding:"10px 14px",border:`1px solid ${P.border}`}}>
        <PeriodComparePicker periods={periods} p1={cP1} p2={cP2} onP1={setCP1} onP2={setCP2} label1="Prior" label2="Current"/>
        <div style={{marginLeft:"auto",display:"flex",gap:12,fontSize:11,color:P.muted}}>
          <span>Debt Ratio: <span style={{color:debtRatio<50?P.green:debtRatio<70?P.gold:P.red,fontWeight:700}}>{debtRatio.toFixed(1)}%</span></span>
          <span>Equity: <span style={{color:P.purple,fontWeight:700}}>{equityRatio.toFixed(1)}%</span></span>
          <span style={{color:bs2.balanced?P.green:P.red,fontWeight:700}}>{bs2.balanced?"✓ Balanced":"⚠ Out of Balance"}</span>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        <KPI label="Total Assets"      value={fmtK(bs2.totalAssets)} color={P.blue}   accent={P.blue}   small sub={<Delta current={bs2.totalAssets} previous={bs1.totalAssets}/>}/>
        <KPI label="Total Liabilities" value={fmtK(bs2.totalLiab)}   color={P.orange} accent={P.orange} small/>
        <KPI label="Total Equity"      value={fmtK(bs2.totalEquity+bs2.currentNP)} color={P.purple} accent={P.purple} small sub="incl. current profit"/>
        <KPI label="Current Period P&L" value={fmtK(bs2.currentNP)} color={bs2.currentNP>=0?P.green:P.red} small sub="auto-linked from GL"/>
        <KPI label="Working Capital"   value={fmtK(workingCapital)}  color={workingCapital>=0?P.green:P.red} small/>
        <KPI label="Debt/Equity"       value={bs2.totalEquity+bs2.currentNP>0?((bs2.totalLiab/(bs2.totalEquity+bs2.currentNP)).toFixed(2)+"x"):"—"} color={P.gold} small/>
      </div>

      <SubTabs tabs={TABS} active={tab} onChange={setTab}/>

      {tab==="statement"&&(
        <Card noPad title={`Balance Sheet as at ${cP2} vs ${cP1} · ${activeE.length} entities · MYR (cumulative GL balances)`}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:P.surf2}}>
                {["Account",cP2,cP1,"Change"].map(h=>(
                  <th key={h} style={{textAlign:h==="Account"?"left":"right",padding:"8px 10px",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {/* ASSETS */}
                <BSHead label="ASSETS" color={P.blue} open={bsOpen.A} onToggle={()=>togBS("A")}/>
                {bsOpen.A&&(bs2.sections["A"]||[]).map(r=><BSRow key={r.code} label={r.name} value={r.value} prevVal={bs1.sections["A"]?.find(x=>x.code===r.code)?.value} indent sub={r.isIC?"(IC)":null}/>)}
                <BSTotal label="TOTAL ASSETS" value={bs2.totalAssets} prevVal={bs1.totalAssets} color={P.blue}/>

                {/* LIABILITIES */}
                <BSHead label="LIABILITIES" color={P.orange} open={bsOpen.L} onToggle={()=>togBS("L")}/>
                {bsOpen.L&&(bs2.sections["L"]||[]).map(r=><BSRow key={r.code} label={r.name} value={r.value} prevVal={bs1.sections["L"]?.find(x=>x.code===r.code)?.value} indent sub={r.isIC?"(IC)":null}/>)}
                <BSTotal label="TOTAL LIABILITIES" value={bs2.totalLiab} prevVal={bs1.totalLiab} color={P.orange}/>

                {/* EQUITY */}
                <BSHead label="EQUITY" color={P.purple} open={bsOpen.E} onToggle={()=>togBS("E")}/>
                {bsOpen.E&&(bs2.sections["E"]||[]).map(r=><BSRow key={r.code} label={r.name} value={r.value} prevVal={bs1.sections["E"]?.find(x=>x.code===r.code)?.value} indent/>)}
                {bsOpen.E&&<BSRow label="Retained Earnings (Current Period)" value={bs2.currentNP} prevVal={bs1.currentNP} indent color={bs2.currentNP>=0?P.green:P.red} sub="← auto-linked from P&L"/>}
                <BSTotal label="TOTAL EQUITY (incl. P&L)" value={bs2.totalEquity+bs2.currentNP} prevVal={bs1.totalEquity+bs1.currentNP} color={P.purple}/>
                <BSTotal label="TOTAL LIABILITIES + EQUITY" value={bs2.totalLiab+bs2.totalEquity+bs2.currentNP} prevVal={bs1.totalLiab+bs1.totalEquity+bs1.currentNP} color={bs2.balanced?P.green:P.red}/>
              </tbody>
            </table>
          </div>
          <div style={{padding:"10px 14px",fontSize:10,color:bs2.balanced?P.green:P.red,background:bs2.balanced?`${P.green}10`:`${P.red}10`}}>
            {bs2.balanced?"✓ Balance sheet balances — Assets = Liabilities + Equity":`⚠ Out of balance by ${fmtMYR(Math.abs(bs2.totalAssets-(bs2.totalLiab+bs2.totalEquity+bs2.currentNP)))} — check GL for missing entries`}
          </div>
        </Card>
      )}

      {tab==="trend"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card title="Balance Sheet Structure — All Periods">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trendData.filter(d=>d.assets>0)} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="period" tick={{fill:P.muted,fontSize:10}}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Legend formatter={v=><span style={{color:P.muted,fontSize:11}}>{v}</span>}/>
                <Bar dataKey="assets"      name="Assets"      fill={P.blue}   radius={[3,3,0,0]}/>
                <Bar dataKey="liabilities" name="Liabilities" fill={P.orange} radius={[3,3,0,0]}/>
                <Bar dataKey="equity"      name="Equity"      fill={P.purple} radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Debt-to-Equity Ratio — Trend">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData.filter(d=>d.assets>0).map(d=>({...d,deRatio:d.equity>0?+(d.liabilities/d.equity).toFixed(3):0}))} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="period" tick={{fill:P.muted,fontSize:10}}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>v.toFixed(1)+"x"}/>
                <ReferenceLine y={1} stroke={P.gold} strokeDasharray="4 4" label={{value:"1x",fill:P.gold,fontSize:9}}/>
                <Tooltip formatter={v=>v.toFixed(2)+"x"} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Line type="monotone" dataKey="deRatio" name="D/E Ratio" stroke={P.purple} strokeWidth={2} dot={{r:3}}/>
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {tab==="compare"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[[cP1,bs1],[cP2,bs2]].map(([p,bs])=>(
              <Card key={p} title={`Balance Sheet — ${p}`} accent={P.blue}>
                {[["Assets",bs.totalAssets,P.blue],["Liabilities",bs.totalLiab,P.orange],["Equity (incl. P&L)",bs.totalEquity+bs.currentNP,P.purple],["Current P&L",bs.currentNP,bs.currentNP>=0?P.green:P.red]].map(([label,val,color])=>(
                  <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${P.border}20`}}>
                    <span style={{color:P.sub,fontSize:11}}>{label}</span>
                    <span style={{fontFamily:"monospace",color,fontWeight:700,fontSize:12}}>{fmtMYR(val)}</span>
                  </div>
                ))}
                <div style={{marginTop:8,fontSize:10,color:bs.balanced?P.green:P.red}}>{bs.balanced?"✓ Balanced":"⚠ Out of balance"}</div>
              </Card>
            ))}
          </div>
          <Card title="Movement — Assets, Liabilities, Equity">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                {metric:"Assets",      change:bs2.totalAssets-(bs1.totalAssets||0)},
                {metric:"Liabilities", change:bs2.totalLiab-(bs1.totalLiab||0)},
                {metric:"Equity",      change:(bs2.totalEquity+bs2.currentNP)-(bs1.totalEquity+bs1.currentNP||0)},
              ]} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="metric" tick={{fill:P.muted,fontSize:11}}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                <ReferenceLine y={0} stroke={P.muted}/>
                <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Bar dataKey="change" name="Movement" radius={[4,4,0,0]}>
                  {[0,1,2].map(i=><Cell key={i} fill={[P.blue,P.orange,P.purple][i]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          {/* By entity */}
          <Card title="Balance Sheet by Entity — Current Period">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
              {activeE.map(e=>{
                const eBS=buildBS(cP2,[e.id]);
                return(
                  <div key={e.id} style={{background:P.surf2,border:`1px solid ${e.color}30`,borderRadius:9,padding:"10px 12px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><EntityDot entity={e} size={7}/><span style={{color:e.color,fontWeight:700,fontSize:11}}>{e.name}</span></div>
                    {[["Assets",eBS.totalAssets,P.blue],["Liabilities",eBS.totalLiab,P.orange],["Equity+P&L",eBS.totalEquity+eBS.currentNP,P.purple]].map(([label,val,color])=>(
                      <div key={label} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{color:P.muted,fontSize:9}}>{label}</span>
                        <span style={{fontFamily:"monospace",color,fontSize:11,fontWeight:700}}>{fmtK(val)}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {tab==="insights"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <InsightPanel title="Asset Composition — Current Period">
            {(()=>{
              const grps=[...new Set((bs2.sections["A"]||[]).map(r=>r.group))];
              const data=grps.map(g=>({name:g,value:(bs2.sections["A"]||[]).filter(r=>r.group===g).reduce((s,r)=>s+r.value,0)})).filter(d=>d.value>0);
              const colors=[P.blue,P.gold,P.green,P.purple,P.orange];
              return(
                <div style={{display:"flex",gap:16,alignItems:"center"}}>
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart><Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35}>
                      {data.map((_,i)=><Cell key={i} fill={colors[i%colors.length]}/>)}
                    </Pie><Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/></PieChart>
                  </ResponsiveContainer>
                  <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
                    {data.map((d,i)=>(
                      <div key={d.name} style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:colors[i%colors.length],flexShrink:0}}/>
                        <span style={{color:P.sub,fontSize:11,flex:1}}>{d.name}</span>
                        <span style={{fontFamily:"monospace",color:P.blue,fontSize:11,fontWeight:700}}>{fmtMYR(d.value)}</span>
                        <span style={{color:P.muted,fontSize:10}}>{bs2.totalAssets>0?((d.value/bs2.totalAssets)*100).toFixed(0):0}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </InsightPanel>
          <InsightPanel title="Capital Structure — Liabilities vs Equity over Time">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trendData.filter(d=>d.assets>0).map(d=>({...d,lPct:d.assets>0?(d.liabilities/d.assets*100):0,ePct:d.assets>0?(d.equity/d.assets*100):0}))} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="period" tick={{fill:P.muted,fontSize:10}}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>v.toFixed(0)+"%"} domain={[0,100]}/>
                <Tooltip formatter={v=>v.toFixed(1)+"%"} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Legend formatter={v=><span style={{color:P.muted,fontSize:11}}>{v}</span>}/>
                <Bar dataKey="lPct" name="Debt %" fill={P.orange} radius={[3,3,0,0]} stackId="a"/>
                <Bar dataKey="ePct" name="Equity %" fill={P.purple} radius={[3,3,0,0]} stackId="a"/>
              </BarChart>
            </ResponsiveContainer>
          </InsightPanel>
          <InsightPanel title="Working Capital Trend">
            <div style={{fontSize:10,color:P.muted,marginBottom:8}}>Current Assets − Current Liabilities. Positive = healthy liquidity.</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={trendData.filter(d=>d.assets>0)} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="period" tick={{fill:P.muted,fontSize:10}}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                <ReferenceLine y={0} stroke={P.red} strokeDasharray="4 4"/>
                <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Line type="monotone" dataKey="assets" name="Total Assets" stroke={P.blue} strokeWidth={2} dot={{r:3}}/>
              </LineChart>
            </ResponsiveContainer>
          </InsightPanel>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// DATA IMPORT HUB — single drag-and-drop for all file types
// ══════════════════════════════════════════════════════════════════

// ── Auto-detection: identify file type from headers ───────────────
function detectFileType(headers) {
  const H = headers.map(h => h.toUpperCase().trim().replace(/\s+/g,""));
  const has = (...keys) => keys.every(k => H.some(h => h.includes(k)));
  if (has("DRACCOUNT","CRACCOUNT"))                          return "gl";
  if (has("STAGE","CLOSEDATE"))                              return "sales";
  if (has("COUNTERPARTY","INVOICEDATE","DUEDATE") && has("STATUS")) {
    // distinguish AR vs AP by TYPE column, or default to AR
    const typeCol = H.findIndex(h => h === "TYPE");
    return "arap";
  }
  if (has("ACCOUNTCODE","BUDGETMYR"))                        return "budget";
  if (has("CLASS") && has("CODE") && has("NAME"))            return "coa";
  if (H.some(h => h === "MYR") && H.some(h => h === "SGD")) return "fx";
  if (has("INVOICEDATE","DUEDATE"))                          return "arap";
  return null;
}

// ── Parse each type ───────────────────────────────────────────────
function parseImport(type, rows, store) {
  const hdrs = rows[0].map(h => h.trim().toUpperCase().replace(/\s+/g,""));
  const col   = k => hdrs.findIndex(h => h === k || h.includes(k));
  const get   = (r, k, fallback="") => { const i = col(k); return i > -1 ? (r[i] || fallback) : fallback; };
  const entities = store.entities || [];

  switch(type) {
    case "gl": {
      return rows.slice(1).map(r => ({
        id:         "JE" + Math.random().toString(36).slice(2,8).toUpperCase(),
        entityId:   get(r,"ENTITYID") || entities[0]?.id || "",
        period:     get(r,"PERIOD"),
        date:       get(r,"DATE"),
        ref:        get(r,"REF"),
        description:get(r,"DESCRIPTION"),
        drAccount:  get(r,"DRACCOUNT"),
        crAccount:  get(r,"CRACCOUNT"),
        currency:   (get(r,"CURRENCY") || "MYR").toUpperCase(),
        amount:     parseFloat(get(r,"AMOUNT")) || 0,
        icEntityId: get(r,"ICENTITYID") || null,
      })).filter(r => r.drAccount && r.crAccount && r.amount);
    }
    case "sales": {
      return rows.slice(1).map(r => ({
        id:        "D" + Math.random().toString(36).slice(2,7).toUpperCase(),
        entityId:  get(r,"ENTITYID") || entities[0]?.id || "",
        name:      get(r,"NAME") || get(r,"DEAL"),
        stage:     get(r,"STAGE") || "Lead",
        value:     parseFloat(get(r,"VALUE")) || 0,
        currency:  (get(r,"CURRENCY") || "MYR").toUpperCase(),
        closeDate: get(r,"CLOSEDATE") || get(r,"CLOSE"),
        owner:     get(r,"OWNER"),
        product:   get(r,"PRODUCT"),
        notes:     get(r,"NOTES"),
      })).filter(r => r.name && r.value);
    }
    case "arap": {
      return rows.slice(1).map(r => {
        const typeVal = (get(r,"TYPE") || "AR").toUpperCase();
        return {
          id:           (typeVal === "AP" ? "AP" : "AR") + "-" + Math.random().toString(36).slice(2,6).toUpperCase(),
          type:         typeVal,
          entityId:     get(r,"ENTITYID") || entities[0]?.id || "",
          counterparty: get(r,"COUNTERPARTY") || get(r,"ENTITY"),
          invoiceDate:  get(r,"INVOICEDATE"),
          dueDate:      get(r,"DUEDATE"),
          currency:     (get(r,"CURRENCY") || "MYR").toUpperCase(),
          amount:       parseFloat(get(r,"AMOUNT")) || 0,
          status:       get(r,"STATUS") || "Outstanding",
          notes:        get(r,"NOTES"),
        };
      }).filter(r => r.counterparty && r.amount);
    }
    case "budget": {
      return rows.slice(1).map(r => ({
        entityId:    get(r,"ENTITYID") || entities[0]?.id || "",
        period:      get(r,"PERIOD"),
        accountCode: get(r,"ACCOUNTCODE"),
        budgetMYR:   parseFloat(get(r,"BUDGETMYR")) || 0,
      })).filter(r => r.accountCode && r.budgetMYR);
    }
    case "coa": {
      return rows.slice(1).map(r => ({
        code:       get(r,"CODE"),
        name:       get(r,"NAME"),
        class:      get(r,"CLASS") || "A",
        group:      get(r,"GROUP"),
        icEligible: (get(r,"ICELIGIBLE") || "").toLowerCase() === "true",
        fxMethod:   get(r,"FXMETHOD") || "closing",
        active:     true,
      })).filter(r => r.code && r.name);
    }
    case "fx": {
      return rows.slice(1).map(r => {
        const period = get(r,"PERIOD");
        if (!period) return null;
        const entry = { period };
        ["MYR","SGD","USD","PHP","IDR","THB","VND"].forEach(c => {
          const i = hdrs.findIndex(h => h === c);
          if (i > -1) { const v = parseFloat(r[i]); if (!isNaN(v)) entry[c] = v; }
        });
        return entry;
      }).filter(Boolean).filter(r => r.MYR);
    }
    default: return null;
  }
}

const FILE_TYPE_META = {
  gl:     { label:"GL Journals",    icon:"⊟", color: "#38BDF8", desc:"EntityId · Period · Date · Ref · Description · DrAccount · CrAccount · Currency · Amount · ICEntityId" },
  sales:  { label:"Sales Deals",    icon:"◉", color: "#22D3A0", desc:"EntityId · Name · Stage · Value · Currency · CloseDate · Owner · Product · Notes" },
  arap:   { label:"AR / AP",        icon:"↕", color: "#FAA819", desc:"Type (AR/AP) · EntityId · Counterparty · InvoiceDate · DueDate · Currency · Amount · Status" },
  budget: { label:"Budget",         icon:"◎", color: "#A78BFA", desc:"EntityId · Period · AccountCode · BudgetMYR" },
  coa:    { label:"Chart of Accounts",icon:"≡",color:"#FB923C", desc:"Code · Name · Class (A/L/E/R/X) · Group · ICEligible · FXMethod" },
  fx:     { label:"FX Rates",       icon:"$", color: "#B84480", desc:"Period · MYR · SGD · USD · PHP · IDR · THB · VND (all as X per USD)" },
};

function ImportHub() {
  const { store, setStore } = useStore();
  const [files,    setFiles]    = useState([]); // [{name,type,rows,parsed,status,count,error}]
  const [dragging, setDragging] = useState(false);
  const [committed,setCommitted]= useState(false);
  const inputRef = useRef();

  async function processFiles(fileList) {
    setCommitted(false);
    const incoming = [];
    for (const file of Array.from(fileList)) {
      try {
        const rows = await readFile(file);
        if (rows.length < 2) { incoming.push({ name:file.name, type:null, rows:[], parsed:null, status:"error", error:"File appears empty" }); continue; }
        const hdrs = rows[0].map(h => h.trim().toUpperCase().replace(/\s+/g,""));
        const type = detectFileType(hdrs);
        if (!type) { incoming.push({ name:file.name, type:null, rows, parsed:null, status:"error", error:"Could not identify file type — check column headers match templates" }); continue; }
        const parsed = parseImport(type, rows, store);
        if (!parsed || !parsed.length) { incoming.push({ name:file.name, type, rows, parsed:null, status:"error", error:"Parsed 0 valid records — check data rows and required columns" }); continue; }
        incoming.push({ name:file.name, type, rows, parsed, status:"ready", count:parsed.length, error:null });
      } catch(e) {
        incoming.push({ name:file.name, type:null, rows:[], parsed:null, status:"error", error:e.message });
      }
    }
    setFiles(prev => {
      // Merge: replace same-named files, add new ones
      const existing = prev.filter(p => !incoming.find(n => n.name === p.name));
      return [...existing, ...incoming];
    });
  }

  function onDrop(e) { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); }
  function onInput(e) { processFiles(e.target.files); e.target.value = ""; }
  function removeFile(name) { setFiles(f => f.filter(x => x.name !== name)); setCommitted(false); }

  function commitAll() {
    const readyFiles = files.filter(f => f.status === "ready" && f.parsed);
    if (!readyFiles.length) return;
    let ns = { ...store };
    readyFiles.forEach(f => {
      switch(f.type) {
        case "gl":     ns = { ...ns, gl:     [...(ns.gl||[]),     ...f.parsed] }; break;
        case "sales":  ns = { ...ns, sales:  [...(ns.sales||[]),  ...f.parsed] }; break;
        case "budget": ns = { ...ns, budget: [...(ns.budget||[]), ...f.parsed] }; break;
        case "coa":    ns = { ...ns, coa:    f.parsed }; break; // replace COA
        case "fx":     ns = { ...ns, fxRates:f.parsed }; break; // replace FX
        case "arap": {
          const newAR = f.parsed.filter(r => r.type === "AR");
          const newAP = f.parsed.filter(r => r.type === "AP");
          if (newAR.length) ns = { ...ns, ar: [...(ns.ar||[]), ...newAR] };
          if (newAP.length) ns = { ...ns, ap: [...(ns.ap||[]), ...newAP] };
          break;
        }
      }
    });
    setStore(ns); persist(ns);
    setFiles(f => f.map(x => x.status === "ready" ? { ...x, status:"committed" } : x));
    setCommitted(true);
  }

  // Template pack download — all 6 templates as separate CSVs zipped... 
  // Instead: download them one by one via a loop (no zip dependency)
  const TEMPLATES = {
    gl:     "EntityId,Period,Date,Ref,Description,DrAccount,CrAccount,Currency,Amount,ICEntityId\nE001,Jan 2025,2025-01-31,SLS-001,Revenue recognition,1100,4000,MYR,50000,\nE001,Jan 2025,2025-01-31,EXP-001,Staff costs,5100,2000,MYR,20000,",
    sales:  "EntityId,Name,Stage,Value,Currency,CloseDate,Owner,Product,Notes\nE001,Deal Name Here,Proposal,50000,MYR,2025-03-31,Owner Name,AI Solutions,Notes",
    arap:   "Type,EntityId,Counterparty,InvoiceDate,DueDate,Currency,Amount,Status,Notes\nAR,E001,Client Sdn Bhd,2025-01-01,2025-01-31,MYR,50000,Outstanding,Invoice notes\nAP,E001,Vendor Pte Ltd,2025-01-01,2025-01-31,SGD,5000,Outstanding,Bill notes",
    budget: "EntityId,Period,AccountCode,BudgetMYR\nE001,Jan 2025,4000,80000\nE001,Jan 2025,5100,35000",
    coa:    "Code,Name,Class,Group,ICEligible,FXMethod\n1000,Cash & Equivalents,A,Current Assets,false,closing\n4000,Revenue External,R,Revenue,false,average",
    fx:     "Period,MYR,SGD,PHP,IDR,THB,VND\nJan 2025,4.50,1.34,57.00,16000,35.50,25000\nFeb 2025,4.48,1.33,56.80,15980,35.30,24900",
  };

  function downloadTemplate(type) {
    const content = TEMPLATES[type];
    const meta    = FILE_TYPE_META[type];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type:"text/csv" }));
    a.download = `finflow_template_${type}.csv`;
    a.click();
  }

  function downloadAllTemplates() {
    Object.keys(TEMPLATES).forEach((type, i) => {
      setTimeout(() => downloadTemplate(type), i * 200);
    });
  }

  // Reset all data
  function resetToSample() {
    if (!window.confirm("Reset ALL data to sample? This cannot be undone.")) return;
    const ns = {
      entities: DEFAULT_ENTITIES, coa: DEFAULT_COA, gl: DEFAULT_GL,
      fxRates: DEFAULT_FX, ar: DEFAULT_AR, ap: DEFAULT_AP,
      budget: DEFAULT_BUDGET, sales: DEFAULT_SALES,
    };
    setStore(ns); persist(ns);
    setFiles([]); setCommitted(false);
  }

  const readyCount     = files.filter(f => f.status === "ready").length;
  const committedCount = files.filter(f => f.status === "committed").length;
  const errorCount     = files.filter(f => f.status === "error").length;
  const totalRecords   = files.filter(f => f.status === "ready").reduce((s,f) => s + (f.count||0), 0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* Header strip */}
      <div style={{ background:`linear-gradient(135deg, ${P.surf3} 0%, ${P.surf2} 100%)`, border:`1px solid ${P.bord2}`, borderRadius:14, padding:"20px 24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${P.gold},${P.mag})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>⬆</div>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:P.text }}>Data Import Hub</div>
            <div style={{ fontSize:11, color:P.muted }}>Drop all your files at once — auto-detected, previewed, committed in one action</div>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
            <Btn onClick={downloadAllTemplates} outline color={P.gold} small>↓ All Templates</Btn>
            <Btn onClick={resetToSample} outline color={P.red} small>Reset to Sample</Btn>
          </div>
        </div>

        {/* Supported types legend */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:14 }}>
          {Object.entries(FILE_TYPE_META).map(([type,meta])=>(
            <div key={type} style={{ display:"flex", alignItems:"center", gap:6, background:P.bg2, border:`1px solid ${meta.color}40`, borderRadius:8, padding:"5px 10px", cursor:"pointer" }} onClick={()=>downloadTemplate(type)} title={`Download ${meta.label} template`}>
              <span style={{ color:meta.color, fontSize:12 }}>{meta.icon}</span>
              <span style={{ color:meta.color, fontSize:10, fontWeight:700 }}>{meta.label}</span>
              <span style={{ color:P.muted, fontSize:9 }}>↓</span>
            </div>
          ))}
          <div style={{ color:P.muted, fontSize:10, alignSelf:"center", marginLeft:4 }}>Click any type to download its template</div>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border:`2px dashed ${dragging ? P.gold : P.border}`,
          borderRadius:16, padding:"48px 24px",
          textAlign:"center", cursor:"pointer",
          background: dragging ? `${P.gold}08` : P.surf2,
          transition:"all 0.2s", userSelect:"none",
          position:"relative",
        }}
      >
        <input ref={inputRef} type="file" multiple accept=".xlsx,.xls,.csv" onChange={onInput} style={{ display:"none" }}/>

        {dragging ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
            <div style={{ fontSize:48 }}>⬇</div>
            <div style={{ color:P.gold, fontSize:16, fontWeight:700 }}>Release to import</div>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ opacity:0.6 }}>
              <rect x="4" y="4" width="48" height="48" rx="12" fill={`${P.gold}15`} stroke={P.gold} strokeWidth="1.5" strokeDasharray="5 3"/>
              <path d="M28 36V20M28 20l-7 7M28 20l7 7" stroke={P.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 42h24" stroke={P.gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
              <circle cx="44" cy="12" r="6" fill={P.mag} opacity="0.8"/>
              <text x="44" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">6</text>
            </svg>
            <div>
              <div style={{ color:P.text, fontSize:16, fontWeight:700, marginBottom:4 }}>Drop all your files here</div>
              <div style={{ color:P.muted, fontSize:12 }}>Accepts multiple files at once · <span style={{ color:P.gold }}>.xlsx</span> and <span style={{ color:P.gold }}>.csv</span></div>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginTop:4 }}>
              {Object.values(FILE_TYPE_META).map(m=>(
                <span key={m.label} style={{ background:`${m.color}15`, color:m.color, border:`1px solid ${m.color}40`, borderRadius:20, padding:"3px 10px", fontSize:10, fontWeight:700 }}>{m.label}</span>
              ))}
            </div>
            <div style={{ color:P.muted, fontSize:11, marginTop:4 }}>File type is auto-detected from column headers — no manual tagging needed</div>
          </div>
        )}
      </div>

      {/* File queue */}
      {files.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {/* Summary bar */}
          <div style={{ display:"flex", gap:12, alignItems:"center", background:P.surf2, borderRadius:10, padding:"10px 16px", border:`1px solid ${P.border}` }}>
            <span style={{ fontSize:12, color:P.sub, fontWeight:600 }}>{files.length} file{files.length!==1?"s":""} queued</span>
            {readyCount>0     && <span style={{ fontSize:11, color:P.green  }}>✓ {readyCount} ready · {totalRecords.toLocaleString()} records</span>}
            {errorCount>0     && <span style={{ fontSize:11, color:P.red   }}>✗ {errorCount} error{errorCount!==1?"s":""}</span>}
            {committedCount>0 && <span style={{ fontSize:11, color:P.gold  }}>● {committedCount} committed</span>}
            <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
              <Btn onClick={() => { setFiles([]); setCommitted(false); }} outline color={P.muted} small>Clear all</Btn>
              {readyCount > 0 && (
                <Btn onClick={commitAll} color={P.gold} style={{ minWidth:140 }}>
                  ⬆ Import {readyCount} file{readyCount!==1?"s":""} → Store
                </Btn>
              )}
            </div>
          </div>

          {/* File cards */}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {files.map(f => {
              const meta = f.type ? FILE_TYPE_META[f.type] : null;
              const isError     = f.status === "error";
              const isReady     = f.status === "ready";
              const isCommitted = f.status === "committed";
              const borderColor = isError ? P.red : isCommitted ? P.gold : isReady ? P.green : P.border;

              return (
                <div key={f.name} style={{ background:P.surface, border:`1px solid ${borderColor}40`, borderRadius:12, padding:"14px 18px", display:"flex", gap:14, alignItems:"flex-start" }}>
                  {/* Type icon */}
                  <div style={{ width:36, height:36, borderRadius:9, background: meta ? `${meta.color}20` : `${P.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, border:`1px solid ${meta?meta.color+"40":P.border}` }}>
                    {isError ? "⚠" : meta?.icon || "?"}
                  </div>

                  {/* Content */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <span style={{ color:P.text, fontWeight:600, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</span>
                      {meta && <Badge label={meta.label} color={meta.color}/>}
                      {isReady     && <Badge label={`${f.count} records`} color={P.green}/>}
                      {isCommitted && <Badge label="✓ Imported" color={P.gold}/>}
                      {isError     && <Badge label="Error" color={P.red}/>}
                    </div>

                    {isError && (
                      <div style={{ color:P.red, fontSize:11, marginBottom:6 }}>✗ {f.error}</div>
                    )}

                    {isReady && f.parsed && (
                      <div style={{ color:P.muted, fontSize:10 }}>
                        {/* Preview first 3 rows */}
                        Preview: {f.parsed.slice(0,3).map((r,i) => {
                          const label = r.name || r.ref || r.counterparty || r.period || r.code || r.accountCode || `row ${i+1}`;
                          const val   = r.amount!=null ? ` · ${fmtAmt?.(r.amount,r.currency)||r.amount}` : r.value!=null ? ` · ${r.currency} ${r.value}` : r.budgetMYR!=null ? ` · RM${r.budgetMYR}` : "";
                          return <span key={i} style={{ marginRight:10, color:P.sub }}>{label}{val}</span>;
                        })}
                        {f.count > 3 && <span style={{ color:P.muted }}>+{f.count-3} more</span>}
                      </div>
                    )}

                    {isCommitted && (
                      <div style={{ color:P.gold, fontSize:11 }}>✓ {f.count} records loaded into {meta?.label}</div>
                    )}

                    {!meta && !isError && (
                      <div style={{ color:P.muted, fontSize:11 }}>
                        Unrecognised headers: <span style={{ color:P.gold }}>{f.rows[0]?.join(", ").slice(0,80)}</span>
                        <div style={{ marginTop:4, color:P.muted, fontSize:10 }}>Required columns not found. Download a template above and check your column headers.</div>
                      </div>
                    )}
                  </div>

                  {/* Remove */}
                  <button onClick={() => removeFile(f.name)} style={{ background:"transparent", border:"none", color:P.muted, cursor:"pointer", fontSize:16, padding:"2px 6px", flexShrink:0 }}>✕</button>
                </div>
              );
            })}
          </div>

          {/* Post-commit success */}
          {committed && readyCount === 0 && committedCount > 0 && (
            <div style={{ background:`${P.green}10`, border:`1px solid ${P.green}40`, borderRadius:12, padding:"16px 20px", display:"flex", gap:14, alignItems:"center" }}>
              <div style={{ fontSize:28 }}>✓</div>
              <div>
                <div style={{ color:P.green, fontWeight:700, fontSize:14, marginBottom:3 }}>Import complete — {committedCount} file{committedCount!==1?"s":""} loaded</div>
                <div style={{ color:P.muted, fontSize:11 }}>All modules updated. Navigate to any module to see your data.</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Store summary */}
      <Card title="Current Data in Store">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10 }}>
          {[
            { label:"FX Periods",   value:(store.fxRates||[]).length,  color:P.mag    },
            { label:"COA Accounts", value:(store.coa||[]).filter(a=>a.active).length, color:P.orange },
            { label:"GL Journals",  value:(store.gl||[]).length,       color:P.blue   },
            { label:"Sales Deals",  value:(store.sales||[]).length,    color:P.green  },
            { label:"AR Invoices",  value:(store.ar||[]).length,       color:P.gold   },
            { label:"AP Bills",     value:(store.ap||[]).length,       color:P.purple },
            { label:"Budget Lines", value:(store.budget||[]).length,   color:P.orange },
            { label:"Entities",     value:(store.entities||[]).filter(e=>e.active).length, color:P.mag },
          ].map(item => (
            <div key={item.label} style={{ background:P.surf2, border:`1px solid ${item.color}30`, borderRadius:10, padding:"10px 14px" }}>
              <div style={{ color:P.muted, fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>{item.label}</div>
              <div style={{ color:item.color, fontFamily:"monospace", fontSize:20, fontWeight:700 }}>{item.value.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Column reference */}
      <Card title="Column Reference — Required Headers per File Type">
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {Object.entries(FILE_TYPE_META).map(([type,meta])=>(
            <div key={type} style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"8px 0", borderBottom:`1px solid ${P.border}20` }}>
              <div style={{ width:130, display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                <span style={{ fontSize:14, color:meta.color }}>{meta.icon}</span>
                <span style={{ color:meta.color, fontSize:11, fontWeight:700 }}>{meta.label}</span>
              </div>
              <div style={{ flex:1 }}>
                <span style={{ color:P.muted, fontSize:10 }}>{meta.desc}</span>
              </div>
              <button onClick={()=>downloadTemplate(type)} style={{ background:"transparent", border:`1px solid ${meta.color}40`, borderRadius:6, color:meta.color, cursor:"pointer", fontSize:10, padding:"3px 10px", fontFamily:"inherit", flexShrink:0 }}>↓ Template</button>
            </div>
          ))}
        </div>
        <div style={{ marginTop:12, fontSize:10, color:P.muted, background:`${P.border}30`, borderRadius:8, padding:"8px 12px" }}>
          <strong style={{ color:P.gold }}>Auto-detection rules:</strong> GL requires DrAccount + CrAccount · Sales requires Stage + CloseDate · AR/AP requires Counterparty + InvoiceDate + DueDate · Budget requires AccountCode + BudgetMYR · COA requires Code + Name + Class · FX requires Period + MYR + SGD columns
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// FinFlow — Auth & Access Control Layer
// ══════════════════════════════════════════════════════════════════

const AUTH_KEY     = "finflow_auth_v1";
const SESSION_KEY  = "finflow_session";

// Client-visible modules only
const CLIENT_MODULES = ["home","sales","arap","fx","pl","bs","budget","cashflow","wc","forecast","close","assets","headcount","reportpack","ai","vendors"];
const ADMIN_MODULES  = ["import","home","entities","coa","fx","sales","arap","gl","ic","pl","bs","budget","cashflow","wc","forecast","close","assets","headcount","reportpack","ai","vendors","pr","po","gr","sinvoice","payrun","users"];

// ══════════════════════════════════════════════════════════════════
// SUBSCRIPTION TIERS — GTM land-and-expand gating (P1 redesign)
// ══════════════════════════════════════════════════════════════════
const TIERS=[
  {id:"T0", name:"Pilot (Free)",      product:"ProcurFlow"},
  {id:"T1", name:"ProcurFlow Starter",product:"ProcurFlow"},
  {id:"T2", name:"ProcurFlow Pro",    product:"ProcurFlow"},
  {id:"T3", name:"FinFlow Lite",      product:"FinFlow"},
  {id:"T4", name:"FinFlow Pro",       product:"FinFlow"},
  {id:"T5", name:"FinFlow AI",        product:"FinFlow"},
  {id:"T6", name:"Full Suite",        product:"FinFlow"},
];
const tierIdx = id => TIERS.findIndex(t=>t.id===id);
const tierName = id => TIERS.find(t=>t.id===id)?.name || id;

// Module visibility state for a client at a given tier.
// "active": tier covers it. "locked": exactly one tier above (greyed
// + upgrade prompt). "hidden": two or more tiers above (not rendered).
function moduleState(navItem, subTier){
  if(!navItem.tier) return "hidden";            // admin-only items never shown to clients
  const need=tierIdx(navItem.tier), have=tierIdx(subTier);
  if(have>=need) return "active";
  if(need===have+1) return "locked";
  return "hidden";
}
// The tier the client must reach to unlock a module's group
function unlockTierFor(navItem){ return tierName(navItem.tier); }

// Days since a date string (yyyy-mm-dd); -1 if blank/invalid
function daysSince(dateStr){
  if(!dateStr) return -1;
  const d=new Date(dateStr); if(isNaN(d)) return -1;
  return Math.floor((Date.now()-d.getTime())/86400000);
}

// ══════════════════════════════════════════════════════════════════
// UPSELL NUDGE ENGINE — N-01…N-05 (P2 redesign, Section 6)
// One active nudge at a time. Dismissed nudges resurface after 14
// days if the client has not upgraded. Copy is narrative-led — CTAs
// open a tier overview, never a pricing screen.
// ══════════════════════════════════════════════════════════════════
const NUDGES=[
  {id:"N-01", targetTier:"T3",
    when:s=>s.tier==="T0"&&daysSince(s.wf01LiveDate)>=30,
    head:"Your approval data is now structured.",
    sub:"Want to see where your budget is going? Add FinFlow Lite.",
    cta:"Show me what FinFlow Lite does"},
  {id:"N-02", targetTier:"T3",
    when:s=>(s.tier==="T1"||s.tier==="T2"),
    head:"Your PO data is flowing.",
    sub:"Set up budget vs actual monitoring with FinFlow Lite.",
    cta:"See FinFlow Lite"},
  {id:"N-03", targetTier:"T4",
    when:s=>(s.tier==="T2"||s.tier==="T3"),
    head:"Your full P2P cycle is complete.",
    sub:"Remove the manual close process entirely with FinFlow Pro.",
    cta:"See FinFlow Pro"},
  {id:"N-04", targetTier:"T4",
    when:s=>s.tier==="T3"&&daysSince(s.fcLiteLiveDate)>=30,
    head:"Month-end close is still manual.",
    sub:"FinFlow Pro automates it from your existing data.",
    cta:"See FinFlow Pro"},
  {id:"N-05", targetTier:"T5",
    when:s=>s.tier==="T4"&&daysSince(s.fcProLiveDate)>=30,
    head:"Your CFO could have a finance assistant.",
    sub:"FinFlow AI is ready — board commentary, anomaly detection, conversational finance.",
    cta:"See FinFlow AI"},
];
// First eligible, non-recently-dismissed nudge. Specific (timed)
// nudges win over generic ones: evaluate N-04/N-05/N-01 before
// the always-on N-02/N-03 at the same tier.
const NUDGE_PRIORITY=["N-01","N-04","N-05","N-03","N-02"];
function activeNudge(sub){
  for(const id of NUDGE_PRIORITY){
    const n=NUDGES.find(x=>x.id===id);
    if(!n.when(sub)) continue;
    const dis=sub.nudgeDismissed?.[n.id];
    if(dis&&daysSince(dis)<14) continue;
    return n;
  }
  return null;
}

// ── Tier overview content (linked from locked nav + nudge CTAs) ───
const TIER_OVERVIEWS={
  T1:{tag:"Structure your purchasing.",
    modules:["WF-02 · Vendor Onboarding","WF-03 · Purchase Orders"],
    value:["Single vendor master — no more duplicate or rogue suppliers","POs raised directly from approved requisitions","Full audit trail from request to order"]},
  T2:{tag:"Close the loop from order to payment.",
    modules:["WF-04 · Goods Receipt","WF-04 · Supplier Invoice","WF-05 · 3-Way Match & Payment"],
    value:["Automated 3-way match — PO, receipt and invoice reconciled for you","Exception-only review: clean invoices flow straight to payment runs","Payment batches with full approval trail"]},
  T3:{tag:"Your P2P data starts telling you something.",
    modules:["Budget vs Actual","AR / AP","Working Capital","Sales"],
    value:["See spend against budget the moment a PO is raised — not at month end","Live AR/AP ageing and working-capital KPIs","Vendor spend summaries built from your own approval data"]},
  T4:{tag:"Close the books without chasing people.",
    modules:["Month-End Close","13-Week Forecast","Cash Flow","P&L","Balance Sheet","Fixed Assets","Headcount & Payroll","Report Pack","FX Rates"],
    value:["Month-end close checklist with task ownership and status","13-week cash forecast driven by live AR/AP and payment runs","Full reporting pack — P&L, balance sheet, cash flow — in one click"]},
  T5:{tag:"A finance assistant for your CFO.",
    modules:["AI Biz Insight"],
    value:["AI-generated board commentary from your live numbers","Anomaly detection across spend, margins and working capital","Ask questions of your finance data in plain language"]},
};

// ── Default admin account ─────────────────────────────────────────
const DEFAULT_ADMIN = {
  id:"admin",
  username:"admin",
  password:"FinFlow2025!",
  role:"admin",
  name:"Administrator",
  entityIds:"all",
  active:true,
  createdAt:"2025-01-01",
};

function loadUsers(){
  try{const r=localStorage.getItem(AUTH_KEY);if(r)return JSON.parse(r);}catch{}
  return[DEFAULT_ADMIN];
}
function saveUsers(u){try{localStorage.setItem(AUTH_KEY,JSON.stringify(u));}catch{}}

function loadSession(){
  try{const r=sessionStorage.getItem(SESSION_KEY);if(r)return JSON.parse(r);}catch{}
  return null;
}
function saveSession(s){try{sessionStorage.setItem(SESSION_KEY,JSON.stringify(s));}catch{}}
function clearSession(){try{sessionStorage.removeItem(SESSION_KEY);}catch{}}

// ── Simple hash (not cryptographic — demo/client preview use only) ─
function hashPwd(s){
  let h=0;
  for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;}
  return h.toString(36);
}

// ══════════════════════════════════════════════════════════════════
// LANDING PAGE
// ══════════════════════════════════════════════════════════════════
function LandingPage({onEnter}){
  return(
    <div style={{minHeight:"100vh",background:P.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      {/* Background blobs */}
      <div style={{position:"absolute",top:-120,right:-120,width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${P.mag}18 0%,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-80,left:-80,width:320,height:320,borderRadius:"50%",background:`radial-gradient(circle,${P.gold}15 0%,transparent 70%)`,pointerEvents:"none"}}/>

      <div style={{maxWidth:520,width:"100%",textAlign:"center",position:"relative",zIndex:1}}>
        {/* Logo mark */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginBottom:40}}>
          <div style={{width:56,height:56,borderRadius:16,background:`linear-gradient(135deg,${P.gold},${P.mag})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:900,color:"#0B0F1A",boxShadow:`0 8px 32px ${P.gold}40`}}>FF</div>
          <div style={{textAlign:"left"}}>
            <div style={{fontSize:28,fontWeight:900,color:P.text,letterSpacing:-1}}>FinFlow</div>
            <div style={{fontSize:11,color:P.muted,letterSpacing:2}}>MULTI-ENTITY FINANCIAL INTELLIGENCE</div>
          </div>
        </div>

        {/* Hero */}
        <div style={{fontSize:36,fontWeight:800,color:P.text,lineHeight:1.15,marginBottom:16,letterSpacing:-1}}>
          Financial clarity<br/>
          <span style={{background:`linear-gradient(90deg,${P.gold},${P.mag})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>across every entity</span>
        </div>
        <div style={{fontSize:15,color:P.sub,lineHeight:1.7,marginBottom:40,maxWidth:420,margin:"0 auto 40px"}}>
          Consolidated P&L, Balance Sheet, Sales pipeline, AR/AP and FX analysis — all in one platform. Built for multi-entity businesses operating across APAC.
        </div>

        {/* Feature pills */}
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:48}}>
          {[["◉","Sales Pipeline"],["▤","P&L & Balance Sheet"],["⇄","IC Consolidation"],["$","FX Multi-Currency"],["◎","Budget vs Actual"],["⇌","Cash Flow"]].map(([icon,label])=>(
            <div key={label} style={{display:"flex",alignItems:"center",gap:6,background:P.surf2,border:`1px solid ${P.border}`,borderRadius:20,padding:"6px 14px"}}>
              <span style={{color:P.gold,fontSize:12}}>{icon}</span>
              <span style={{color:P.sub,fontSize:11,fontWeight:500}}>{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button onClick={onEnter} style={{background:`linear-gradient(135deg,${P.gold},${P.mag})`,border:"none",borderRadius:14,padding:"16px 48px",fontSize:16,fontWeight:800,color:"#0B0F1A",cursor:"pointer",boxShadow:`0 4px 24px ${P.gold}40`,letterSpacing:-0.3,transition:"all 0.2s"}}>
          Sign In to FinFlow →
        </button>
        <div style={{marginTop:20,fontSize:11,color:P.muted}}>Powered by SGC · SynerGrowth Consulting</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ══════════════════════════════════════════════════════════════════
function LoginScreen({onLogin,prefillUser=""}){
  const [username,setUsername]=useState(prefillUser);
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const [showPwd,setShowPwd]=useState(false);

  function attempt(){
    setError(""); setLoading(true);
    setTimeout(()=>{
      const users=loadUsers();
      const user=users.find(u=>u.username.toLowerCase()===username.toLowerCase().trim()&&u.active);
      if(!user){setError("Username not found or account disabled.");setLoading(false);return;}
      // Accept plain or hashed
      const match=user.password===password||user.password===hashPwd(password);
      if(!match){setError("Incorrect password.");setLoading(false);return;}
      const session={userId:user.id,role:user.role,name:user.name,username:user.username,entityIds:user.entityIds,loginAt:Date.now()};
      saveSession(session);
      setLoading(false);
      onLogin(session);
    },400);
  }

  return(
    <div style={{minHeight:"100vh",background:P.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{position:"absolute",top:-100,right:-100,width:360,height:360,borderRadius:"50%",background:`radial-gradient(circle,${P.mag}15 0%,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-60,left:-60,width:280,height:280,borderRadius:"50%",background:`radial-gradient(circle,${P.gold}12 0%,transparent 70%)`,pointerEvents:"none"}}/>

      <div style={{width:"100%",maxWidth:400,position:"relative",zIndex:1}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:36,justifyContent:"center"}}>
          <div style={{width:44,height:44,borderRadius:12,background:`linear-gradient(135deg,${P.gold},${P.mag})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:"#0B0F1A"}}>FF</div>
          <div>
            <div style={{fontSize:20,fontWeight:800,color:P.text,letterSpacing:-0.5}}>FinFlow</div>
            <div style={{fontSize:9,color:P.muted,letterSpacing:2}}>MULTI-ENTITY FINANCE</div>
          </div>
        </div>

        <div style={{background:P.surface,border:`1px solid ${P.border}`,borderRadius:16,padding:"32px 28px",boxShadow:`0 8px 48px #00000060`}}>
          <div style={{fontSize:18,fontWeight:700,color:P.text,marginBottom:6}}>Welcome back</div>
          <div style={{fontSize:12,color:P.muted,marginBottom:24}}>Sign in to access your financial dashboard</div>

          <div style={{marginBottom:16}}>
            <div style={{color:P.muted,fontSize:10,fontWeight:700,letterSpacing:1.5,marginBottom:6}}>USERNAME</div>
            <input value={username} onChange={e=>setUsername(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&attempt()}
              placeholder="Enter your username"
              style={{width:"100%",background:P.surf2,border:`1px solid ${error?P.red:P.border}`,borderRadius:9,color:P.text,padding:"11px 14px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}
              autoFocus={!prefillUser}
            />
          </div>

          <div style={{marginBottom:error?16:24}}>
            <div style={{color:P.muted,fontSize:10,fontWeight:700,letterSpacing:1.5,marginBottom:6}}>PASSWORD</div>
            <div style={{position:"relative"}}>
              <input value={password} onChange={e=>setPassword(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&attempt()}
                type={showPwd?"text":"password"}
                placeholder="Enter your password"
                style={{width:"100%",background:P.surf2,border:`1px solid ${error?P.red:P.border}`,borderRadius:9,color:P.text,padding:"11px 40px 11px 14px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}
                autoFocus={!!prefillUser}
              />
              <button onClick={()=>setShowPwd(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:P.muted,cursor:"pointer",fontSize:14,padding:0}}>
                {showPwd?"🙈":"👁"}
              </button>
            </div>
          </div>

          {error&&(
            <div style={{background:`${P.red}15`,border:`1px solid ${P.red}40`,borderRadius:8,padding:"9px 12px",marginBottom:16,color:P.red,fontSize:12}}>
              ✗ {error}
            </div>
          )}

          <button onClick={attempt} disabled={loading||!username||!password}
            style={{width:"100%",background:`linear-gradient(135deg,${P.gold},${P.mag})`,border:"none",borderRadius:10,padding:"13px",fontSize:14,fontWeight:700,color:"#0B0F1A",cursor:loading||!username||!password?"not-allowed":"pointer",opacity:loading||!username||!password?0.7:1,transition:"all 0.15s"}}>
            {loading?"Signing in…":"Sign In →"}
          </button>

          <div style={{marginTop:20,fontSize:11,color:P.muted,textAlign:"center"}}>
            Contact your administrator if you need access
          </div>
        </div>

        <div style={{marginTop:16,fontSize:10,color:P.muted,textAlign:"center"}}>
          FinFlow · Multi-Entity Financial Intelligence · SGC
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// USER MANAGEMENT MODULE  (admin only)
// ══════════════════════════════════════════════════════════════════
function UserModule({session,store,onLogout}){
  const [users,setUsersState]=useState(loadUsers);
  const [tab,setTab]=useState("users");
  const [copied,setCopied]=useState("");

  function saveU(u){setUsersState(u);saveUsers(u);}

  const BLANK={id:"",username:"",password:"",role:"client",name:"",entityIds:[],active:true};
  const [form,setForm]=useState({...BLANK});
  const [editing,setEditing]=useState(null);
  const [showPwd,setShowPwd]=useState(false);

  const entities=store.entities||[];
  const activeE=entities.filter(e=>e.active);

  function toggleEntity(id){
    setForm(f=>({...f,entityIds:Array.isArray(f.entityIds)?f.entityIds.includes(id)?f.entityIds.filter(x=>x!==id):[...f.entityIds,id]:[id]}));
  }

  function save(){
    if(!form.username.trim()||!form.password.trim()||!form.name.trim())return;
    const entry={...form,id:form.id||"U"+Math.random().toString(36).slice(2,8).toUpperCase()};
    const updated=editing?users.map(u=>u.id===editing?entry:u):[...users,entry];
    saveU(updated);setForm({...BLANK});setEditing(null);
  }
  function startEdit(u){setForm({...u,entityIds:u.entityIds==="all"?[]:u.entityIds||[]});setEditing(u.id);}
  function toggleActive(id){saveU(users.map(u=>u.id===id?{...u,active:!u.active}:u));}
  function deleteUser(id){if(id==="admin")return;if(!window.confirm("Delete this user?"))return;saveU(users.filter(u=>u.id!==id));}

  // Generate shareable link
  function getLink(username){
    const base=window.location.href.split("?")[0];
    return `${base}?user=${encodeURIComponent(username)}`;
  }
  function copyLink(username){
    navigator.clipboard.writeText(getLink(username));
    setCopied(username);
    setTimeout(()=>setCopied(""),2500);
  }

  const clients=users.filter(u=>u.role==="client");
  const admins=users.filter(u=>u.role==="admin");

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        <SubTabs tabs={[{id:"users",label:"Manage Users"},{id:"add",label:editing?"Edit User":"+ New User"}]} active={tab} onChange={setTab}/>
        <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          <div style={{fontSize:11,color:P.muted}}>{clients.length} client{clients.length!==1?"s":""} · {admins.length} admin{admins.length!==1?"s":""}</div>
          <button onClick={onLogout} style={{background:"transparent",border:`1px solid ${P.border}`,borderRadius:7,color:P.muted,cursor:"pointer",fontSize:11,padding:"5px 12px",fontFamily:"inherit"}}>Sign Out</button>
        </div>
      </div>

      {tab==="users"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {users.map(u=>{
            const assignedE=u.entityIds==="all"?activeE:activeE.filter(e=>u.entityIds?.includes(e.id));
            const link=getLink(u.username);
            return(
              <div key={u.id} style={{background:P.surface,border:`1px solid ${u.active?P.bord2:P.border}`,borderRadius:12,padding:"16px 18px",opacity:u.active?1:0.6}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
                  {/* Avatar */}
                  <div style={{width:40,height:40,borderRadius:10,background:u.role==="admin"?`linear-gradient(135deg,${P.gold},${P.mag})`:`linear-gradient(135deg,${P.blue}80,${P.purple}80)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#0B0F1A",flexShrink:0}}>
                    {u.name.slice(0,2).toUpperCase()}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                      <span style={{color:P.text,fontWeight:700,fontSize:14}}>{u.name}</span>
                      <Badge label={u.role==="admin"?"Admin":"Client"} color={u.role==="admin"?P.gold:P.blue}/>
                      <Badge label={u.active?"Active":"Inactive"} color={u.active?P.green:P.muted}/>
                    </div>
                    <div style={{color:P.muted,fontSize:11,marginBottom:8}}>
                      @{u.username}
                      {u.role==="client"&&<span style={{marginLeft:12}}>Entities: {u.entityIds==="all"?"All":assignedE.map(e=><span key={e.id} style={{marginLeft:4,color:e.color,fontWeight:600}}>{e.name}</span>)}</span>}
                    </div>
                    {/* Shareable link */}
                    {u.role==="client"&&u.active&&(
                      <div style={{display:"flex",gap:8,alignItems:"center",background:P.surf2,borderRadius:8,padding:"7px 12px",border:`1px solid ${P.border}`}}>
                        <span style={{color:P.muted,fontSize:10,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{link}</span>
                        <button onClick={()=>copyLink(u.username)} style={{background:copied===u.username?`${P.green}20`:"transparent",border:`1px solid ${copied===u.username?P.green:P.border}`,borderRadius:6,color:copied===u.username?P.green:P.gold,cursor:"pointer",fontSize:10,padding:"3px 10px",fontFamily:"inherit",flexShrink:0,fontWeight:600,transition:"all 0.2s"}}>
                          {copied===u.username?"✓ Copied!":"Copy Link"}
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Actions */}
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    {u.id!=="admin"&&<Btn onClick={()=>{startEdit(u);setTab("add");}} small outline color={P.gold}>Edit</Btn>}
                    {u.id!=="admin"&&<Btn onClick={()=>toggleActive(u.id)} small outline color={u.active?P.muted:P.green}>{u.active?"Disable":"Enable"}</Btn>}
                    {u.id!=="admin"&&<Btn onClick={()=>deleteUser(u.id)} small outline danger>✕</Btn>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab==="add"&&(
        <div style={{background:P.surface,border:`1px solid ${P.bord2}`,borderRadius:14,padding:"24px 24px"}}>
          <div style={{fontSize:15,fontWeight:700,color:P.text,marginBottom:18}}>{editing?"Edit User":"Create New User"}</div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div>
              <div style={{color:P.muted,fontSize:10,fontWeight:700,letterSpacing:1.5,marginBottom:6}}>FULL NAME *</div>
              <Input value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Ahmad Razif"/>
            </div>
            <div>
              <div style={{color:P.muted,fontSize:10,fontWeight:700,letterSpacing:1.5,marginBottom:6}}>USERNAME * <span style={{color:P.muted,fontSize:9,fontWeight:400}}>(used for login & link)</span></div>
              <Input value={form.username} onChange={v=>setForm(f=>({...f,username:v.toLowerCase().replace(/\s+/g,"")}))} placeholder="e.g. ahmad.razif"/>
            </div>
            <div>
              <div style={{color:P.muted,fontSize:10,fontWeight:700,letterSpacing:1.5,marginBottom:6}}>PASSWORD *</div>
              <div style={{position:"relative"}}>
                <input value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} type={showPwd?"text":"password"} placeholder="Set a password"
                  style={{width:"100%",background:P.surf2,border:`1px solid ${P.border}`,borderRadius:7,color:P.text,padding:"7px 36px 7px 11px",fontSize:12,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                <button onClick={()=>setShowPwd(s=>!s)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:P.muted,cursor:"pointer",fontSize:12,padding:0}}>{showPwd?"🙈":"👁"}</button>
              </div>
            </div>
            <div>
              <div style={{color:P.muted,fontSize:10,fontWeight:700,letterSpacing:1.5,marginBottom:6}}>ROLE</div>
              <Sel value={form.role} onChange={v=>setForm(f=>({...f,role:v}))} style={{width:"100%"}}>
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </Sel>
            </div>
          </div>

          {form.role==="client"&&(
            <div style={{marginBottom:18}}>
              <div style={{color:P.muted,fontSize:10,fontWeight:700,letterSpacing:1.5,marginBottom:8}}>ENTITY ACCESS <span style={{color:P.muted,fontSize:9,fontWeight:400}}>— client sees only selected entities</span></div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {activeE.map(e=>{
                  const sel=Array.isArray(form.entityIds)&&form.entityIds.includes(e.id);
                  return(
                    <button key={e.id} onClick={()=>toggleEntity(e.id)} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 12px",borderRadius:8,border:`1px solid ${sel?e.color:P.border}`,background:sel?`${e.color}18`:"transparent",cursor:"pointer",fontFamily:"inherit",transition:"all 0.12s"}}>
                      <EntityDot entity={e} size={7}/>
                      <span style={{color:sel?e.color:P.muted,fontSize:12,fontWeight:sel?600:400}}>{e.name}</span>
                    </button>
                  );
                })}
              </div>
              {Array.isArray(form.entityIds)&&form.entityIds.length===0&&<div style={{color:P.red,fontSize:11,marginTop:6}}>⚠ Select at least one entity</div>}
            </div>
          )}

          <div style={{display:"flex",gap:10}}>
            <Btn onClick={save} color={P.gold} disabled={!form.name||!form.username||!form.password||(form.role==="client"&&(!Array.isArray(form.entityIds)||!form.entityIds.length))}>
              {editing?"Save Changes":"Create User"}
            </Btn>
            {editing&&<Btn onClick={()=>{setForm({...BLANK});setEditing(null);setTab("users");}} outline color={P.muted}>Cancel</Btn>}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// AUTHED FINFLOW APP  (role-aware wrapper)
// ══════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════
// TIER OVERVIEW MODAL — one-page value overview per tier. Linked
// from locked nav items and nudge CTAs. No pricing shown: pricing
// is introduced by SGC in the follow-up conversation.
// ══════════════════════════════════════════════════════════════════
function TierOverviewModal({tierId,onClose}){
  const t=TIERS.find(x=>x.id===tierId);
  const ov=TIER_OVERVIEWS[tierId];
  if(!t||!ov) return null;
  const isFF=t.product==="FinFlow";
  const accent=isFF?P.mag:P.gold;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"#000A",backdropFilter:"blur(3px)",zIndex:60,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:520,background:P.bg2,border:`1px solid ${accent}55`,borderRadius:16,overflow:"hidden"}}>
        <div style={{padding:"20px 24px",background:`linear-gradient(135deg,${accent}22,transparent)`,borderBottom:`1px solid ${P.border}`}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:accent,textTransform:"uppercase",marginBottom:4}}>{t.product}</div>
          <div style={{fontSize:19,fontWeight:800,color:P.text}}>{t.name}</div>
          <div style={{fontSize:12,color:P.sub,marginTop:3}}>{ov.tag}</div>
        </div>
        <div style={{padding:"18px 24px"}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:P.muted,textTransform:"uppercase",marginBottom:8}}>What you unlock</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
            {ov.modules.map(m=><span key={m} style={{fontSize:10,fontWeight:600,color:accent,background:`${accent}16`,border:`1px solid ${accent}44`,borderRadius:6,padding:"4px 9px"}}>{m}</span>)}
          </div>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:P.muted,textTransform:"uppercase",marginBottom:8}}>Why it matters</div>
          {ov.value.map((v,i)=>(
            <div key={i} style={{display:"flex",gap:9,marginBottom:8}}>
              <span style={{color:accent,fontSize:11,flexShrink:0,marginTop:1}}>◆</span>
              <span style={{fontSize:12,color:P.sub,lineHeight:1.5}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{padding:"14px 24px 20px",display:"flex",gap:10,alignItems:"center",borderTop:`1px solid ${P.border}`}}>
          <a href={`mailto:Lawrence@synergrowth.com.sg?subject=${encodeURIComponent(PRODUCT_NAME+" — upgrade to "+t.name)}`}
            style={{background:accent,color:"#0B0F1A",borderRadius:8,padding:"9px 16px",fontSize:12,fontWeight:800,textDecoration:"none"}}>Talk to SGC about {t.name}</a>
          <button onClick={onClose} style={{background:"none",border:`1px solid ${P.border}`,borderRadius:8,color:P.muted,cursor:"pointer",fontSize:11,padding:"8px 14px",fontFamily:"inherit"}}>Not now</button>
        </div>
      </div>
    </div>
  );
}

// ── Global upsell nudge banner — one at a time, dismissible ───────
function NudgeBanner({nudge,onCta,onDismiss}){
  return(
    <div style={{margin:"0 0 16px",padding:"13px 16px",background:`linear-gradient(135deg,${P.surface},${P.mag}14)`,border:`1px solid ${P.mag}66`,borderRadius:12,display:"flex",alignItems:"center",gap:13}}>
      <div style={{fontSize:18,flexShrink:0}}>✦</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:12,fontWeight:800,color:P.text,marginBottom:2}}>{nudge.head}</div>
        <div style={{fontSize:11,color:P.sub}}>{nudge.sub}</div>
      </div>
      <button onClick={onCta} style={{background:P.mag,color:"#fff",border:"none",borderRadius:8,padding:"8px 14px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>{nudge.cta}</button>
      <button onClick={onDismiss} title="Dismiss" style={{background:"none",border:"none",color:P.muted,cursor:"pointer",fontSize:14,flexShrink:0}}>✕</button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// PILOT OVERVIEW — WF-01 client view (tier T0). Exactly 3 elements:
// 1. Active PR queue  2. Approval status & SLA  3. What's Next nudge
// ══════════════════════════════════════════════════════════════════
function PilotOverview({store}){
  const prs=store.purchaseReqs||[];
  const open=prs.filter(p=>p.status!=="Approved"&&p.status!=="Rejected");
  const counts=prs.reduce((a,p)=>{a[p.status]=(a[p.status]||0)+1;return a;},{});
  const today=Date.now();
  const slaDays=p=>{const d=new Date(p.requiredDate);return isNaN(d)?null:Math.ceil((d.getTime()-today)/86400000);};
  const stClr={Draft:P.muted,Submitted:P.gold,Approved:P.green,Rejected:P.red};

  const card={background:P.surface,border:`1px solid ${P.border}`,borderRadius:12,padding:18};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {/* 2 — Approval status & SLA strip */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {["Draft","Submitted","Approved","Rejected"].map(s=>(
          <div key={s} style={{...card,padding:"14px 16px"}}>
            <div style={{fontSize:10,color:P.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{s}</div>
            <div style={{fontSize:24,fontWeight:800,color:stClr[s]}}>{counts[s]||0}</div>
          </div>
        ))}
      </div>

      {/* 1 — Active PR queue */}
      <div style={card}>
        <div style={{fontSize:13,fontWeight:800,color:P.text,marginBottom:12}}>Active Purchase Requisitions</div>
        {open.length===0
          ?<div style={{color:P.muted,fontSize:11,padding:"8px 0"}}>No open requisitions. New requests appear here for approval.</div>
          :<table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead><tr>{["PR No.","Requestor","Department","Amount","Status","SLA"].map(h=>
              <th key={h} style={{textAlign:"left",color:P.muted,fontWeight:600,fontSize:9,letterSpacing:1,textTransform:"uppercase",padding:"6px 8px",borderBottom:`1px solid ${P.border}`}}>{h}</th>)}
            </tr></thead>
            <tbody>{open.map(p=>{
              const d=slaDays(p);
              const overdue=d!==null&&d<0;
              return(
                <tr key={p.id}>
                  <td style={{padding:"8px",color:P.text,fontWeight:600,borderBottom:`1px solid ${P.border}`}}>{p.prNumber}</td>
                  <td style={{padding:"8px",color:P.sub,borderBottom:`1px solid ${P.border}`}}>{p.requestor}</td>
                  <td style={{padding:"8px",color:P.sub,borderBottom:`1px solid ${P.border}`}}>{p.department}</td>
                  <td style={{padding:"8px",color:P.text,borderBottom:`1px solid ${P.border}`}}>{CCY_SYM[p.currency]||""}{(p.estimatedTotal||0).toLocaleString()}</td>
                  <td style={{padding:"8px",borderBottom:`1px solid ${P.border}`}}><span style={{color:stClr[p.status]||P.sub,fontWeight:700}}>{p.status}</span></td>
                  <td style={{padding:"8px",borderBottom:`1px solid ${P.border}`,color:overdue?P.red:d!==null&&d<=3?P.gold:P.green,fontWeight:700}}>
                    {d===null?"—":overdue?`${Math.abs(d)}d overdue`:`${d}d left`}
                  </td>
                </tr>
              );
            })}</tbody>
          </table>}
      </div>

      {/* 3rd pilot element (What's Next nudge) renders globally via NudgeBanner */}
    </div>
  );
}

function AuthedApp({session,onLogout}){
  const [store,setStoreRaw]=useState(initStore);

  // For clients: filter store to their entities only
  const effectiveEntityIds=useMemo(()=>{
    if(session.role==="admin"||session.entityIds==="all") return store.entities.filter(e=>e.active).map(e=>e.id);
    return (session.entityIds||[]).filter(id=>store.entities.find(e=>e.id===id&&e.active));
  },[session,store.entities]);

  const [active,setActive]=useState("home");
  const [capturePrefill,setCapturePrefill]=useState(null);
  const CAPTURE_ROUTE={supplier_invoice:"sinvoice",goods_receipt:"gr",vendor_master:"vendors",fixed_assets:"assets",archive:"home"};
  const handleGlobalCapture=({module,payload})=>{setCapturePrefill({screenKey:CAPTURE_ROUTE[module]||"home",payload});setActive(CAPTURE_ROUTE[module]||"home");};
  const prefillFor=key=>capturePrefill?.screenKey===key?capturePrefill.payload:null;
  const clearPrefill=()=>setCapturePrefill(null);
  const [gf,setGf]=useState({periodFrom:"",periodTo:"",entityIds:effectiveEntityIds});

  // Keep gf entityIds in sync with session (clients can't expand their own access)
  const prevIds=useRef(effectiveEntityIds.join());
  if(session.role!=="admin"&&prevIds.current!==effectiveEntityIds.join()){
    prevIds.current=effectiveEntityIds.join();
    setGf(f=>({...f,entityIds:effectiveEntityIds}));
  }

  const setStore=ns=>{setStoreRaw(ns);persist(ns);};
  const ctx=useMemo(()=>({store,setStore}),[store]);

  // Tier-gated nav (GTM P1): clients see active + locked-next-tier
  // modules only; modules ≥2 tiers above are hidden entirely.
  const isAdmin=session.role==="admin";
  const sub=store.subscription||DEFAULT_SUBSCRIPTION;
  const navStates=NAV.map(n=>({...n,state:isAdmin?"active":moduleState(n,sub.tier)}));
  const visibleNav=navStates.filter(n=>isAdmin?ADMIN_MODULES.includes(n.id):n.state!=="hidden");
  if(isAdmin&&!visibleNav.find(n=>n.id==="users")){
    visibleNav.push({id:"users",icon:"👤",label:"User Management",group:"Admin",state:"active"});
  }
  const allowedIds=isAdmin?ADMIN_MODULES:navStates.filter(n=>n.state==="active").map(n=>n.id);

  // Ensure active module is accessible
  if(!allowedIds.includes(active)&&active!=="users"){setActive("home");}

  // P2: tier overview modal (locked nav clicks + nudge CTAs)
  const [tierModal,setTierModal]=useState(null);
  // P2: product identity — accent follows the active module's product
  const activeGroup=NAV.find(n=>n.id===active)?.group||"";
  const isFFView=activeGroup.startsWith("FinFlow");
  const productBadge=activeGroup==="ProcurFlow"?"ProcurFlow":isFFView?"FinFlow Intelligence":null;
  const accent=isFFView?P.mag:P.gold;
  // P2: one active nudge at a time (clients only)
  const nudge=!isAdmin?activeNudge(sub):null;
  const dismissNudge=n=>setStore({...store,subscription:{...sub,nudgeDismissed:{...sub.nudgeDismissed,[n.id]:new Date().toISOString().slice(0,10)}}});
  // Tier change stamps activation dates when crossing into T3/T4
  const changeTier=t=>{
    const next={...sub,tier:t};
    const today=new Date().toISOString().slice(0,10);
    if(tierIdx(t)>=tierIdx("T3")&&!next.fcLiteLiveDate) next.fcLiteLiveDate=today;
    if(tierIdx(t)>=tierIdx("T4")&&!next.fcProLiveDate)  next.fcProLiveDate=today;
    setStore({...store,subscription:next});
  };

  const moduleLabel=active==="users"?"User Management":NAV.find(n=>n.id===active)?.label||"Overview";

  return(
    <Ctx.Provider value={ctx}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:${P.bg2}}::-webkit-scrollbar-thumb{background:${P.border};border-radius:4px}`}</style>
      <div style={{display:"flex",minHeight:"100vh",background:P.bg,color:P.text,fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>

        {/* Sidebar */}
        <div style={{width:216,flexShrink:0,background:P.bg2,borderRight:`1px solid ${P.border}`,display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0,overflowY:"auto"}}>
          <div style={{padding:"16px 16px 12px",borderBottom:`1px solid ${P.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:30,height:30,borderRadius:8,background:`linear-gradient(135deg,${P.gold},${P.mag})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#0B0F1A",flexShrink:0}}>FF</div>
              <div>
                <div style={{fontSize:13,fontWeight:800,color:P.text,letterSpacing:-0.3}}>{PRODUCT_NAME}</div>
                <div style={{fontSize:8,color:P.muted,letterSpacing:1.2}}>MULTI-ENTITY FINANCE</div>
              </div>
            </div>
            {/* Session pill */}
            <div style={{marginTop:10,display:"flex",alignItems:"center",gap:7,background:P.surf2,borderRadius:8,padding:"7px 10px",border:`1px solid ${P.border}`}}>
              <div style={{width:22,height:22,borderRadius:6,background:isAdmin?`linear-gradient(135deg,${P.gold},${P.mag})`:`linear-gradient(135deg,${P.blue}80,${P.purple}80)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#0B0F1A",flexShrink:0}}>
                {session.name.slice(0,2).toUpperCase()}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{color:P.text,fontSize:11,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{session.name}</div>
                <div style={{color:isAdmin?P.gold:P.blue,fontSize:9,fontWeight:700,letterSpacing:1}}>{isAdmin?"ADMIN":"CLIENT"}</div>
              </div>
              <button onClick={onLogout} title="Sign out" style={{background:"none",border:"none",color:P.muted,cursor:"pointer",fontSize:14,padding:"2px 4px",flexShrink:0}}>⏏</button>
            </div>
          </div>

          {/* Nav with groups */}
          <div style={{padding:"8px 8px 0",flex:1}}>
            {(()=>{
              const groups=[...new Set(visibleNav.map(n=>n.group))];
              const grpColor=g=>g==="ProcurFlow"?P.gold:(g&&g.startsWith("FinFlow"))?P.mag:P.muted;
              return groups.map(grp=>{
                const items=visibleNav.filter(n=>n.group===grp);
                return(
                  <div key={grp}>
                    {grp&&<div style={{color:grpColor(grp),fontSize:8,fontWeight:700,letterSpacing:2,padding:"8px 9px 3px",textTransform:"uppercase"}}>{grp}</div>}
                    {items.map(n=>{
                      const locked=n.state==="locked";
                      return(
                      <button key={n.id} onClick={()=>{locked?setTierModal(n.tier):setActive(n.id);}}
                        title={locked?`Upgrade to ${unlockTierFor(n)} — click to see what's included`:undefined}
                        style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"7px 9px",borderRadius:8,border:"none",cursor:"pointer",background:active===n.id?`${P.gold}18`:"transparent",marginBottom:1,fontFamily:"inherit",textAlign:"left",transition:"all 0.12s",opacity:locked?0.45:1}}>
                        <span style={{fontSize:12,color:active===n.id?P.gold:P.muted,width:18,textAlign:"center",flexShrink:0}}>{locked?"🔒":n.icon}</span>
                        <span style={{fontSize:11,fontWeight:active===n.id?700:400,color:active===n.id?P.gold:P.sub,lineHeight:1.3}}>{n.label}</span>
                        {active===n.id&&<div style={{marginLeft:"auto",width:3,height:3,borderRadius:"50%",background:P.gold}}/>}
                      </button>
                      );
                    })}
                  </div>
                );
              });
            })()}
            {/* SGC admin: client subscription tier control */}
            {isAdmin&&(
              <div style={{margin:"10px 9px 4px",padding:"9px 10px",background:P.surf2,border:`1px solid ${P.border}`,borderRadius:8}}>
                <div style={{color:P.muted,fontSize:8,fontWeight:700,letterSpacing:2,marginBottom:5,textTransform:"uppercase"}}>Client Tier (GTM)</div>
                <select value={sub.tier}
                  onChange={e=>changeTier(e.target.value)}
                  style={{width:"100%",background:P.surface,color:P.text,border:`1px solid ${P.bord2}`,borderRadius:6,padding:"5px 7px",fontSize:10,fontFamily:"inherit"}}>
                  {TIERS.map(t=><option key={t.id} value={t.id}>{t.id} — {t.name}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Global filters */}
          <div style={{borderTop:`1px solid ${P.border}`}}>
            <GlobalFilters store={store} gf={gf} setGf={session.role==="admin"?setGf:f=>{
              // Clients can only change period, not entity access
              setGf(prev=>({...f,entityIds:effectiveEntityIds}));
            }}/>
          </div>
          <div style={{padding:"8px 14px",borderTop:`1px solid ${P.border}`,fontSize:9,color:P.muted}}>
            {gf.entityIds.length} entit{gf.entityIds.length!==1?"ies":"y"} · MYR base
          </div>
        </div>

        {/* Main */}
        <div style={{flex:1,overflowY:"auto",minWidth:0}}>
          <div style={{borderBottom:`1px solid ${P.border}`,padding:"11px 22px",display:"flex",alignItems:"center",gap:12,background:`${P.surface}CC`,backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{fontSize:14,fontWeight:700,color:P.text}}>{moduleLabel}</div>
                {productBadge&&<span style={{fontSize:8,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",color:accent,background:`${accent}16`,border:`1px solid ${accent}44`,borderRadius:5,padding:"3px 7px"}}>{productBadge}</span>}
              </div>
              <div style={{fontSize:10,color:P.muted,marginTop:1}}>
                {gf.entityIds.length} entit{gf.entityIds.length!==1?"ies":"y"}
                {gf.periodFrom||gf.periodTo?` · ${gf.periodFrom||"start"} → ${gf.periodTo||"latest"}`:" · all periods"}
                {!isAdmin&&<span style={{marginLeft:8,color:P.blue,fontWeight:600}}>· Client View</span>}
              </div>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{fontSize:10,color:P.muted}}>Base: <span style={{color:P.mag,fontWeight:700}}>MYR</span></div>
              <button onClick={onLogout} style={{background:"transparent",border:`1px solid ${P.border}`,borderRadius:7,color:P.muted,cursor:"pointer",fontSize:11,padding:"5px 10px",fontFamily:"inherit"}}>Sign Out</button>
            </div>
          </div>

          <div style={{padding:"18px 22px",maxWidth:1160,margin:"0 auto"}}>
            {nudge&&<NudgeBanner nudge={nudge} onCta={()=>setTierModal(nudge.targetTier)} onDismiss={()=>dismissNudge(nudge)}/>}
            {tierModal&&<TierOverviewModal tierId={tierModal} onClose={()=>setTierModal(null)}/>}
            {active==="users"    &&isAdmin&&<UserModule session={session} store={store} onLogout={onLogout}/>}
            {active==="import"   &&isAdmin&&<ImportHub/>}
            {active==="home"     &&(!isAdmin&&sub.tier==="T0"
              ?<PilotOverview store={store} sub={sub} setStore={setStore}/>
              :<Overview store={store} gf={gf}/>)}
            {active==="entities" &&isAdmin&&<EntityModule/>}
            {active==="coa"      &&isAdmin&&<COAModule/>}
            {active==="fx"       &&<FXModule gf={gf}/>}
            {active==="sales"    &&<SalesModule gf={gf}/>}
            {active==="arap"     &&<ARAPModule gf={gf}/>}
            {active==="gl"       &&isAdmin&&<GLModule gf={gf}/>}
            {active==="ic"       &&isAdmin&&<ICModule gf={gf}/>}
            {active==="pl"       &&<PLModule gf={gf}/>}
            {active==="bs"       &&<BSModule gf={gf}/>}
            {active==="budget"   &&<BudgetModule gf={gf}/>}
            {active==="cashflow" &&<CashFlowModule gf={gf}/>}
            {active==="wc"       &&<WorkingCapitalModule gf={gf}/>}
            {active==="forecast"  &&<RollingForecastModule gf={gf}/>}
            {active==="close"    &&<CloseTrackerModule gf={gf}/>}
            {active==="assets"   &&<FixedAssetModule gf={gf}/>}
            {active==="headcount"&&<HeadcountModule gf={gf}/>}
            {active==="reportpack"&&<ReportPackModule gf={gf}/>}
            {active==="ai"       &&<AIInsightsModule gf={gf}/>}
            {active==="vendors"  &&<VendorMasterModule gf={gf} prefill={prefillFor("vendors")} clearPrefill={clearPrefill}/>}
            {active==="pr"       &&<PRModule gf={gf}/>}
            {active==="po"       &&<POModule gf={gf}/>}
            {active==="gr"       &&<GRModule gf={gf} prefill={prefillFor("gr")} clearPrefill={clearPrefill}/>}
            {active==="sinvoice" &&<SupplierInvoiceModule gf={gf} prefill={prefillFor("sinvoice")} clearPrefill={clearPrefill}/>}
            {active==="payrun"   &&<PaymentRunModule gf={gf}/>}
            <CaptureFab onComplete={handleGlobalCapture}/>
          </div>
        </div>
      </div>
    </Ctx.Provider>
  );
}

// ══════════════════════════════════════════════════════════════════
// ROOT — Auth gate
// ══════════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════
// PLSegmental + BalanceSheetSegmental — collapsible report modules
// ══════════════════════════════════════════════════════════════════

const PL_SEG_DATA = {
  year: "FY 2025",
  columns: ["ALL", "COMMUNICATION", "OTHER"],
  sections: [
    { id:"seg_rev", label:"Revenue", values:[523489000,16234000,0], collapsible:true, children:[
      { label:"Sales Revenue - Domestic", values:[371910000,9350000,0] },
      { label:"Sales Revenue - Export",   values:[150970000,6800000,0] },
      { label:"Intercompany Revenue",     values:[609000,84000,0] },
    ]},
    { id:"seg_cos", label:"Cost of Sales", values:[188260000,6732000,0], collapsible:true, children:[
      { label:"Direct Materials", values:[129860000,4260000,0] },
      { label:"Direct Labour",    values:[58400000,2472000,0] },
    ]},
    { id:"seg_gp",    label:"Gross Profit",  values:[335229000,9502000,0], type:"subtotal" },
    { id:"seg_gppct", label:"GP %",          values:[0.64,0.585,0],        type:"metric", format:"pct" },
    { id:"seg_nonop", label:"Total Non Operating Income / (Expenses)", values:[0,0,0], collapsible:true, children:[] },
    { id:"seg_dc", label:"Total Direct Cost (DC)", values:[39592000,1739500,0], collapsible:true, children:[
      { label:"Staff Cost - Direct",   values:[19495000,847000,0] },
      { label:"Staff Cost - Indirect", values:[11039000,500500,0] },
      { label:"Marketing & Selling",   values:[9058000,392000,0] },
      { label:"Travelling Expenses",   values:[0,0,0] },
    ]},
    { id:"seg_sr", label:"Total Staff Reward", values:[0,0,0], collapsible:true, children:[
      { label:"Manning Cost-Bonus",        values:[0,0,0] },
      { label:"Manning Cost-Incentive",    values:[0,0,0] },
      { label:"Manning Cost-Staff Reward", values:[0,0,0] },
    ]},
    { id:"seg_idc", label:"Total Indirect Cost (IDC)", values:[22943000,1296500,0], collapsible:true, children:[
      { label:"General & Admin",                   values:[14882000,1018500,0] },
      { label:"Financing Expenses",                values:[0,0,0] },
      { label:"Share of Corp Manning costs",       values:[0,0,0] },
      { label:"Share of Corp Manning costs-Bonus", values:[0,0,0] },
      { label:"Depreciation Expense",              values:[8061000,278000,0] },
      { label:"Interest Expense",                  values:[0,0,0] },
    ]},
    { id:"seg_opex", label:"Total Operating Expenses", values:[62535000,3036000,0], type:"subtotal" },
    { id:"seg_pbt",  label:"Profit Before Tax",        values:[272694000,6466000,0], type:"total" },
  ],
};

function fmtSegVal(v, fmt) {
  if (fmt === "pct") return v === 0 ? "0.0%" : (v * 100).toFixed(1) + "%";
  return v === 0 ? "0" : v.toLocaleString("en-US");
}

function PLSegmental() {
  const init = {};
  PL_SEG_DATA.sections.forEach(s => { if (s.collapsible) init[s.id] = !!(s.children && s.children.length); });
  const [exp, setExp] = useState(init);
  const tog = id => setExp(prev => ({ ...prev, [id]: !prev[id] }));
  const rowBg = type => type==="total" ? P.surf3 : type==="subtotal" ? P.surf2 : P.surface;

  return (
    <div style={{ background: P.bg, color: P.text, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ padding: "20px 20px 10px", borderBottom: `1px solid ${P.border}` }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: P.text, marginBottom: 4 }}>
          <span style={{ color: P.mag }}>↗ </span>P&amp;L by Segmental — {PL_SEG_DATA.year}
        </div>
        <div style={{ fontSize: 12, color: P.muted }}>P&amp;L consolidated by business segments. Click rows to expand.</div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: P.surface, borderBottom: `2px solid ${P.border}` }}>
              <th style={{ padding: "8px 14px", textAlign: "left", color: P.muted, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", width: "55%" }}>DESCRIPTION</th>
              {PL_SEG_DATA.columns.map(c => (
                <th key={c} style={{ padding: "8px 14px", textAlign: "right", color: P.muted, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em" }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PL_SEG_DATA.sections.map(s => {
              const type = s.type || (s.collapsible ? "section" : "line");
              const isOpen = exp[s.id];
              const bold = type === "subtotal" || type === "total" || type === "section";
              const rows = [];
              rows.push(
                <tr key={s.id}
                  style={{ background: rowBg(type), borderBottom: `1px solid ${P.border}`, cursor: s.collapsible ? "pointer" : "default" }}
                  onClick={s.collapsible ? () => tog(s.id) : undefined}>
                  <td style={{ padding: "8px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {s.collapsible && (
                        <span style={{ color: P.mag, fontWeight: 700, fontSize: 14, minWidth: 14 }}>
                          {isOpen ? "∨" : "›"}
                        </span>
                      )}
                      <span style={{ fontWeight: bold ? 700 : 400, paddingLeft: s.collapsible ? 0 : 20, color: type==="metric" ? P.muted : P.text }}>
                        {s.label}
                      </span>
                    </div>
                  </td>
                  {s.values.map((v, i) => (
                    <td key={i} style={{ padding: "8px 14px", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: bold ? 700 : 400, color: type==="metric" ? P.muted : bold ? P.gold : P.text }}>
                      {fmtSegVal(v, s.format)}
                    </td>
                  ))}
                </tr>
              );
              if (s.collapsible && isOpen) {
                s.children.forEach((child, ci) => {
                  rows.push(
                    <tr key={`${s.id}-c${ci}`} style={{ background: P.bg2, borderBottom: `1px solid ${P.border}` }}>
                      <td style={{ padding: "6px 14px 6px 38px", color: P.sub }}>{child.label}</td>
                      {child.values.map((v, i) => (
                        <td key={i} style={{ padding: "6px 14px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: P.sub }}>
                          {fmtSegVal(v)}
                        </td>
                      ))}
                    </tr>
                  );
                });
              }
              return rows;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const BS_SEG_DATA = {
  year: "FY 2025",
  assets: {
    sections: [
      { id:"bss_nca", label:"Non-Current Assets", total:84564000, collapsible:true, children:[
        { label:"Property Plant and Equipment", value:3675000 },
        { label:"Property Plant and Equipment", value:6150000 },
        { label:"Property Plant and Equipment", value:72000000 },
        { label:"Accumulated Depreciation",     value:2550000 },
        { label:"Accumulated Depreciation",     value:135000 },
        { label:"Accumulated Depreciation",     value:54000 },
      ]},
      { id:"bss_ca", label:"Current Assets", total:634521000, collapsible:true, children:[
        { label:"Cash and Bank - SGD",                value:12758000 },
        { label:"Cash and Bank - PHP",                value:412100000 },
        { label:"Cash and Bank - MYR",                value:24680000 },
        { label:"Cash and Bank - USD",                value:0 },
        { label:"Accounts Receivable - Trade",        value:8120000 },
        { label:"Accounts Receivable - Trade",        value:162200000 },
        { label:"Accounts Receivable - Trade",        value:12920000 },
        { label:"Accounts Receivable - Intercompany", value:84000 },
        { label:"Accounts Receivable - Intercompany", value:1659000 },
        { label:"Prepaid Expenses",                   value:0 },
      ]},
    ],
    total: 719085000, totalLabel: "Total Assets",
  },
  el: {
    sections: [
      { id:"bss_cl", label:"Current Liabilities", total:212972000, collapsible:true, children:[
        { label:"Accounts Payable - Trade",        value:5430000 },
        { label:"Accounts Payable - Trade",        value:133100000 },
        { label:"Accounts Payable - Trade",        value:10560000 },
        { label:"Accounts Payable - Intercompany", value:1400000 },
        { label:"Accounts Payable - Intercompany", value:343000 },
        { label:"Accrued Expenses",                value:2632000 },
        { label:"Accrued Expenses",                value:3717000 },
        { label:"Accrued Expenses",                value:55790000 },
        { label:"Tax Payable",                     value:0 },
      ]},
      { id:"bss_ncl", label:"Non-Current Liabilities", total:36345000, collapsible:true, children:[] },
    ],
    totalLiabilities: 249317000, totalLiabilitiesLabel: "Total Liabilities",
    netCurrentAssets: 421549000,
    equity: { id:"bss_eq", label:"Equity", total:185130000, collapsible:true, children:[
      { label:"Share Capital",     value:11250000 },
      { label:"Share Capital",     value:7350000 },
      { label:"Share Capital",     value:166500000 },
      { label:"Retained Earnings", value:0 },
      { label:"Retained Earnings", value:0 },
      { label:"Retained Earnings", value:0 },
    ]},
    total: 434447000, totalLabel: "Total Equity & Liabilities",
    balanced: false,
  },
};

function numFmt(v) { return v === 0 ? "0" : v.toLocaleString("en-US"); }

function BSSection({ section, exp, tog }) {
  const isOpen = exp[section.id];
  return (
    <>
      <div
        onClick={section.collapsible ? () => tog(section.id) : undefined}
        style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"8px 0", borderBottom:`1px solid ${P.border}`,
          cursor: section.collapsible ? "pointer" : "default" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {section.collapsible && (
            <span style={{ color:P.mag, fontWeight:700, minWidth:14, fontSize:14 }}>
              {isOpen ? "∨" : "›"}
            </span>
          )}
          <span style={{ fontWeight:600, color:P.text }}>{section.label}</span>
        </div>
        <span style={{ fontWeight:600, color:P.gold, fontVariantNumeric:"tabular-nums" }}>
          {numFmt(section.total)}
        </span>
      </div>
      {section.collapsible && isOpen && section.children.map((c, i) => (
        <div key={i} style={{ display:"flex", justifyContent:"space-between",
          padding:"5px 0 5px 34px", background:P.bg2, borderBottom:`1px solid ${P.border}` }}>
          <span style={{ color:P.sub, fontSize:12 }}>{c.label}</span>
          <span style={{ color:P.sub, fontSize:12, fontVariantNumeric:"tabular-nums" }}>{numFmt(c.value)}</span>
        </div>
      ))}
    </>
  );
}

function BalanceSheetSegmental() {
  const allSecs = [...BS_SEG_DATA.assets.sections, ...BS_SEG_DATA.el.sections, BS_SEG_DATA.el.equity];
  const init = {};
  allSecs.forEach(s => { if (s.collapsible) init[s.id] = !!(s.children && s.children.length); });
  const [exp, setExp] = useState(init);
  const tog = id => setExp(prev => ({ ...prev, [id]: !prev[id] }));
  const el = BS_SEG_DATA.el;

  const GrandRow = ({ label, value }) => (
    <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 0",
      borderTop:`2px solid ${P.border}`, marginTop:8, background:P.surf2 }}>
      <span style={{ fontWeight:700, color:P.text }}>{label}</span>
      <span style={{ fontWeight:700, color:P.gold, fontVariantNumeric:"tabular-nums" }}>{numFmt(value)}</span>
    </div>
  );

  const SubRow = ({ label, value }) => (
    <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0",
      borderTop:`1px solid ${P.border}`, background:P.surf2, marginTop:4 }}>
      <span style={{ fontWeight:700, color:P.text }}>{label}</span>
      <span style={{ fontWeight:700, color:P.gold, fontVariantNumeric:"tabular-nums" }}>{numFmt(value)}</span>
    </div>
  );

  const ColHdr = () => (
    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:P.muted,
      fontWeight:600, letterSpacing:"0.05em", padding:"5px 0",
      borderBottom:`1px solid ${P.border}`, marginBottom:4 }}>
      <span>DESCRIPTION</span><span>AMOUNT</span>
    </div>
  );

  return (
    <div style={{ background:P.bg, color:P.text, fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ padding:"20px 20px 10px", borderBottom:`1px solid ${P.border}` }}>
        <div style={{ fontSize:16, fontWeight:700, color:P.text, marginBottom:4 }}>
          <span style={{ color:P.mag }}>↗ </span>Balance Sheet — {BS_SEG_DATA.year}
        </div>
        <div style={{ fontSize:12, color:P.muted }}>Consolidated Balance Sheet. Click sections to expand.</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", alignItems:"start", fontSize:13 }}>
        <div style={{ padding:"16px 20px 32px" }}>
          <div style={{ fontSize:14, fontWeight:700, color:P.text, marginBottom:10, paddingBottom:6, borderBottom:`2px solid ${P.border}` }}>Assets</div>
          <ColHdr/>
          {BS_SEG_DATA.assets.sections.map(s => <BSSection key={s.id} section={s} exp={exp} tog={tog}/>)}
          <GrandRow label={BS_SEG_DATA.assets.totalLabel} value={BS_SEG_DATA.assets.total}/>
        </div>
        <div style={{ padding:"16px 20px 32px", borderLeft:`1px solid ${P.border}` }}>
          <div style={{ fontSize:14, fontWeight:700, color:P.text, marginBottom:10, paddingBottom:6, borderBottom:`2px solid ${P.border}` }}>Equity &amp; Liabilities</div>
          <ColHdr/>
          {el.sections.map(s => <BSSection key={s.id} section={s} exp={exp} tog={tog}/>)}
          <SubRow label={el.totalLiabilitiesLabel} value={el.totalLiabilities}/>
          <div style={{ display:"flex", justifyContent:"space-between", padding:"7px 10px",
            color:P.gold, fontWeight:500, background:P.surf3, borderRadius:4,
            margin:"6px 0", fontStyle:"italic", fontSize:13 }}>
            <span>Net Current Assets</span>
            <span style={{ fontVariantNumeric:"tabular-nums" }}>{numFmt(el.netCurrentAssets)}</span>
          </div>
          <BSSection section={el.equity} exp={exp} tog={tog}/>
          <GrandRow label={el.totalLabel} value={el.total}/>
          {!el.balanced && (
            <div style={{ marginTop:16, display:"inline-block", padding:"5px 12px",
              background:`${P.red}20`, border:`1px solid ${P.red}40`,
              borderRadius:4, color:P.red, fontSize:12, fontWeight:500 }}>
              ⚠ WARNING: Balance Sheet Not Balanced
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FinFlowRoot(){
  // Read ?user= from URL for shareable links
  const urlUser=useMemo(()=>{
    try{const p=new URLSearchParams(window.location.search);return p.get("user")||"";}catch{return "";}
  },[]);

  const [screen,setScreen]=useState(()=>{
    const s=loadSession();
    if(s) return "app";
    return urlUser?"login":"landing";
  });
  const [session,setSession]=useState(()=>loadSession());

  function handleLogin(s){setSession(s);setScreen("app");}
  function handleLogout(){clearSession();setSession(null);setScreen(urlUser?"login":"landing");}

  if(screen==="app"&&session)  return <AuthedApp session={session} onLogout={handleLogout}/>;
  if(screen==="login")         return <LoginScreen onLogin={handleLogin} prefillUser={urlUser}/>;
  return <LandingPage onEnter={()=>setScreen("login")}/>;
}

// ══════════════════════════════════════════════════════════════════
// AI INSIGHTS MODULE
// ══════════════════════════════════════════════════════════════════

// ── Context builder — computes a rich data summary for the AI ─────
function buildAIContext(store, gf, periods) {
  const gl      = store.gl      || [];
  const coa     = store.coa     || [];
  const fxRates = store.fxRates || [];
  const ar      = store.ar      || [];
  const ap      = store.ap      || [];
  const sales   = store.sales   || [];
  const budget  = store.budget  || [];
  const entities= store.entities|| [];
  const entityIds = (gf && gf.entityIds) ? gf.entityIds : entities.filter(e=>e.active).map(e=>e.id);
  const activeE   = entities.filter(e => e.active && entityIds.includes(e.id));

  if (!fxRates.length) return {
    reportingPeriod:"No FX data", priorPeriod:"—", entities:[],
    pl:{curRevenue:"—",prevRevenue:"—",revGrowth:"—",curProfit:"—",prevProfit:"—",
        profitGrowth:"—",gpMargin:"—",ytdRevenue:"—",ytdProfit:"—",topRevenueAccounts:[],vsRevenueBudget:"—"},
    byEntity:[], receivables:{totalOutstanding:"—",overdueAmount:"—",overdueCount:0,overdueRatio:"—",topOverdueDebtors:[],netExposure:"—"},
    payables:{totalOutstanding:"—",overdueAmount:"—",overdueCount:0},
    sales:{wonRevenue:"—",pipelineValue:"—",weightedForecast:"—",winRate:"—",totalDeals:0,wonDeals:0,activeDeals:0,topProductsByRevenue:[],dealsClosingSoon:[]},
    fxExposure:[],baseCurrency:"MYR",
  };

  // Latest two periods for comparison
  const allP   = fxRates.map(r => r.period);
  const toIdx  = gf.periodTo   ? allP.indexOf(gf.periodTo)   : allP.length - 1;
  const fromIdx= gf.periodFrom ? allP.indexOf(gf.periodFrom) : 0;
  const curPeriod  = allP[toIdx]   || allP[allP.length - 1];
  const prevPeriod = allP[toIdx > 0 ? toIdx - 1 : 0];

  // FX helper (simplified — spot rate to MYR)
  const spot = fxRates[fxRates.length - 1] || {};
  function toRM(amt, ccy) {
    if (!amt) return 0;
    if (ccy === "MYR") return amt;
    if (ccy === "USD") return amt * (spot.MYR || 4.5);
    const r = spot[ccy]; const m = spot.MYR;
    return (r && m) ? amt * (m / r) : amt;
  }

  // ── P&L for a period set ──────────────────────────────────────
  function plForPeriods(pds, eids) {
    const revAccts = coa.filter(a => a.class === "R" && a.active);
    const expAccts = coa.filter(a => a.class === "X" && a.active);
    let rev = 0, exp = 0, byAcct = {};
    eids.forEach(eid => {
      const e = entities.find(x => x.id === eid);
      const ccy = e?.currency || "MYR";
      const avgRate = (() => {
        const rates = pds.map(p => getFxRate(fxRates, p, ccy));
        return rates.reduce((a, b) => a + b, 0) / (rates.length || 1);
      })();
      gl.filter(j => j.entityId === eid && pds.includes(j.period)).forEach(j => {
        revAccts.forEach(a => {
          if (j.crAccount === a.code) { const v = j.amount * avgRate; rev += v; byAcct[a.code] = (byAcct[a.code] || 0) + v; }
          if (j.drAccount === a.code) { rev -= j.amount * avgRate; }
        });
        expAccts.forEach(a => {
          if (j.drAccount === a.code) { const v = j.amount * avgRate; exp += v; byAcct[a.code] = (byAcct[a.code] || 0) - v; }
        });
      });
    });
    return { rev, exp, profit: rev - exp, byAcct };
  }

  // ── P&L by entity ─────────────────────────────────────────────
  const entityPL = activeE.map(e => {
    const cur  = plForPeriods([curPeriod],  [e.id]);
    const prev = plForPeriods([prevPeriod], [e.id]);
    return {
      name: e.name, country: e.country, currency: e.currency,
      curRev: cur.rev, prevRev: prev.rev,
      curProfit: cur.profit, prevProfit: prev.profit,
      revGrowth: prev.rev > 0 ? ((cur.rev - prev.rev) / prev.rev * 100).toFixed(1) : null,
    };
  });

  // ── Group P&L ─────────────────────────────────────────────────
  const curPL  = plForPeriods([curPeriod],  entityIds);
  const prevPL = plForPeriods([prevPeriod], entityIds);
  const ytdPL  = plForPeriods(allP.slice(fromIdx, toIdx + 1), entityIds);

  // Top revenue accounts
  const topRevAccts = Object.entries(curPL.byAcct)
    .filter(([,v]) => v > 0)
    .sort(([,a],[,b]) => b - a)
    .slice(0, 5)
    .map(([code, val]) => ({ name: coa.find(a=>a.code===code)?.name || code, value: Math.round(val) }));

  // ── AR/AP ─────────────────────────────────────────────────────
  const arActive = ar.filter(r => entityIds.includes(r.entityId) && r.status !== "Paid");
  const apActive = ap.filter(r => entityIds.includes(r.entityId) && r.status !== "Paid");
  const arTotal  = arActive.reduce((s,r) => s + toRM(r.amount, r.currency), 0);
  const apTotal  = apActive.reduce((s,r) => s + toRM(r.amount, r.currency), 0);
  const arOverdue= arActive.filter(r => r.status === "Overdue");
  const apOverdue= apActive.filter(r => r.status === "Overdue");
  const arOvdAmt = arOverdue.reduce((s,r) => s + toRM(r.amount, r.currency), 0);
  const apOvdAmt = apOverdue.reduce((s,r) => s + toRM(r.amount, r.currency), 0);
  // Top debtors
  const debtorMap = {};
  arOverdue.forEach(r => {
    const k = r.counterparty;
    debtorMap[k] = (debtorMap[k] || 0) + toRM(r.amount, r.currency);
  });
  const topDebtors = Object.entries(debtorMap).sort(([,a],[,b]) => b-a).slice(0,3)
    .map(([name,val]) => ({ name, value: Math.round(val) }));

  // ── Sales pipeline ────────────────────────────────────────────
  const filtSales = sales.filter(d => entityIds.includes(d.entityId));
  const wonDeals  = filtSales.filter(d => d.stage === "Won");
  const activeDls = filtSales.filter(d => !["Won","Lost"].includes(d.stage));
  const wonRev    = wonDeals.reduce((s,d) => s + toRM(d.value, d.currency), 0);
  const pipeline  = activeDls.reduce((s,d) => s + toRM(d.value, d.currency), 0);
  const weighted  = activeDls.reduce((s,d) => s + toRM(d.value,d.currency) * ({"Lead":0.1,"Qualified":0.25,"Proposal":0.5,"Negotiation":0.75}[d.stage]||0), 0);
  const lostDls   = filtSales.filter(d => d.stage === "Lost");
  const winRate   = wonDeals.length + lostDls.length > 0
    ? (wonDeals.length / (wonDeals.length + lostDls.length) * 100).toFixed(0) : null;
  // By product
  const prodMap = {};
  wonDeals.forEach(d => { prodMap[d.product] = (prodMap[d.product] || 0) + toRM(d.value,d.currency); });
  const topProducts = Object.entries(prodMap).sort(([,a],[,b]) => b-a).slice(0,4)
    .map(([name,val]) => ({ name, value: Math.round(val) }));
  // Deals near closing
  const nearClose = activeDls
    .filter(d => d.closeDate && new Date(d.closeDate) <= new Date(Date.now() + 45*86400000))
    .sort((a,b) => new Date(a.closeDate) - new Date(b.closeDate))
    .slice(0,3)
    .map(d => ({ name:d.name, stage:d.stage, value:Math.round(toRM(d.value,d.currency)), closeDate:d.closeDate, entity:entities.find(e=>e.id===d.entityId)?.name }));

  // ── Budget variance ───────────────────────────────────────────
  const budgetRev = budget.filter(b => entityIds.includes(b.entityId) && b.period === curPeriod && coa.find(a=>a.code===b.accountCode)?.class==="R").reduce((s,b)=>s+b.budgetMYR,0);
  const budgetExp = budget.filter(b => entityIds.includes(b.entityId) && b.period === curPeriod && coa.find(a=>a.code===b.accountCode)?.class==="X").reduce((s,b)=>s+b.budgetMYR,0);

  // ── FX exposure ───────────────────────────────────────────────
  const ccyExposure = {};
  arActive.forEach(r => { if(r.currency!=="MYR") ccyExposure[r.currency] = (ccyExposure[r.currency]||0) + toRM(r.amount,r.currency); });
  apActive.forEach(r => { if(r.currency!=="MYR") ccyExposure[r.currency] = (ccyExposure[r.currency]||0) - toRM(r.amount,r.currency); });

  // ── Format numbers nicely for the AI ─────────────────────────
  const fmt = v => v >= 1e6 ? `RM ${(v/1e6).toFixed(2)}M` : v >= 1000 ? `RM ${(v/1000).toFixed(0)}K` : `RM ${Math.round(v)}`;

  return {
    // Metadata
    reportingPeriod: curPeriod,
    priorPeriod: prevPeriod,
    entities: activeE.map(e => `${e.name} (${e.country}, ${e.currency})`),

    // P&L summary
    pl: {
      curRevenue:    fmt(curPL.rev),
      prevRevenue:   fmt(prevPL.rev),
      revGrowth:     prevPL.rev > 0 ? ((curPL.rev - prevPL.rev)/prevPL.rev*100).toFixed(1)+"%" : "N/A",
      curProfit:     fmt(curPL.profit),
      prevProfit:    fmt(prevPL.profit),
      profitGrowth:  prevPL.profit !== 0 ? ((curPL.profit - prevPL.profit)/Math.abs(prevPL.profit)*100).toFixed(1)+"%" : "N/A",
      gpMargin:      curPL.rev > 0 ? ((curPL.rev-curPL.exp)/curPL.rev*100).toFixed(1)+"%" : "N/A",
      ytdRevenue:    fmt(ytdPL.rev),
      ytdProfit:     fmt(ytdPL.profit),
      topRevenueAccounts: topRevAccts,
      vsRevenueBudget: budgetRev > 0 ? `${curPL.rev > budgetRev ? "+" : ""}${((curPL.rev-budgetRev)/budgetRev*100).toFixed(1)}% (${fmt(curPL.rev-budgetRev)})` : "No budget set",
    },

    // By entity
    byEntity: entityPL.map(e => ({
      ...e,
      curRev:    fmt(e.curRev),
      prevRev:   fmt(e.prevRev),
      curProfit: fmt(e.curProfit),
    })),

    // AR/AP
    receivables: {
      totalOutstanding:  fmt(arTotal),
      overdueAmount:     fmt(arOvdAmt),
      overdueCount:      arOverdue.length,
      overdueRatio:      arTotal > 0 ? (arOvdAmt/arTotal*100).toFixed(0)+"%" : "0%",
      topOverdueDebtors: topDebtors.map(d => `${d.name}: ${fmt(d.value)}`),
      netExposure:       fmt(arTotal - apTotal),
    },
    payables: {
      totalOutstanding: fmt(apTotal),
      overdueAmount:    fmt(apOvdAmt),
      overdueCount:     apOverdue.length,
    },

    // Sales
    sales: {
      wonRevenue:       fmt(wonRev),
      pipelineValue:    fmt(pipeline),
      weightedForecast: fmt(weighted),
      winRate:          winRate ? winRate+"%" : "N/A",
      totalDeals:       filtSales.length,
      wonDeals:         wonDeals.length,
      activeDeals:      activeDls.length,
      topProductsByRevenue: topProducts.map(p => `${p.name}: ${fmt(p.value)}`),
      dealsClosingSoon: nearClose.map(d => `${d.name} (${d.stage}, ${fmt(d.value)}, closes ${d.closeDate}, ${d.entity})`),
    },

    // FX
    fxExposure: Object.entries(ccyExposure).map(([ccy,val]) => `${ccy}: net ${val>0?"receivable":"payable"} ${fmt(Math.abs(val))}`),
    baseCurrency: "MYR",
  };
}

// ── Insight prompt templates ──────────────────────────────────────
const INSIGHT_PROMPTS = {
  executive: {
    label: "Executive Summary",      icon: "◈", color: "#FAA819",
    desc:  "Overall business health narrative",
    prompt: (c) => "You are a senior Finance Manager presenting to the board of " + (c.entities||[]).join(", ") + ". Write a crisp executive summary of the business for " + c.reportingPeriod + " vs " + c.priorPeriod + ". Cover: (1) headline performance, (2) key drivers of growth or decline, (3) top 2-3 risks, (4) recommended actions. Be specific with numbers. Write in flowing paragraphs, not bullet points. Tone: direct, confident, like a CFO briefing.",
  },
  revenue: {
    label: "Revenue Deep Dive",      icon: "▤", color: "#22D3A0",
    desc:  "What drove revenue — by entity, product, period",
    prompt: (c) => "You are a Finance Manager analysing revenue for " + c.reportingPeriod + ". Based on the data, explain: (1) what drove revenue growth or decline and from which entity, (2) which revenue streams are strongest and which are weakening, (3) how performance compares to budget, (4) specific recommendations to protect or grow revenue. Be specific. Use the numbers provided. Write 3-4 paragraphs.",
  },
  profitability: {
    label: "Profitability Analysis",  icon: "◎", color: "#A78BFA",
    desc:  "Margin trends, cost drivers, profit quality",
    prompt: (c) => "You are a Finance Manager analysing profitability for " + (c.entities||[]).join(", ") + " in " + c.reportingPeriod + ". Analyse: (1) gross and net profit margin trends, (2) which entities are most and least profitable, (3) what cost pressures are emerging, (4) what actions would improve margins. Be direct and specific. Write 3-4 paragraphs.",
  },
  cashflow: {
    label: "Cash & Working Capital",  icon: "⇌", color: "#38BDF8",
    desc:  "Liquidity, AR/AP health, collection risk",
    prompt: (c) => "You are a Finance Manager reviewing cash and working capital for " + c.reportingPeriod + ". Analyse: (1) the AR overdue position and collection risk — call out the top debtors by name, (2) net cash exposure (AR minus AP), (3) payables position, (4) specific actions to improve cash conversion — who to chase, what to negotiate. Write like a Finance Manager who will present this to a CEO tomorrow.",
  },
  sales: {
    label: "Sales & Pipeline",        icon: "◉", color: "#FB923C",
    desc:  "Pipeline health, win rate, forecast accuracy",
    prompt: (c) => "You are a Finance Manager bridging sales and finance for " + (c.entities||[]).join(", ") + ". Analyse the sales pipeline and provide: (1) commentary on won revenue and what drove it — which products, entities, (2) pipeline quality assessment — is the weighted forecast realistic?, (3) deals at risk and deals closest to closing — name them specifically, (4) recommended actions for the sales team. Write 3-4 paragraphs, be specific.",
  },
  fx: {
    label: "FX & Currency Risk",      icon: "$", color: "#B84480",
    desc:  "Multi-currency exposure and hedging signals",
    prompt: (c) => "You are a Finance Manager reviewing FX and currency risk for a multi-entity APAC business. Base currency is MYR. Analyse: (1) net currency exposures and which are material, (2) which entities carry the most FX risk given their functional currencies, (3) whether current FX rates are favourable or unfavourable vs prior period, (4) recommended hedging or invoicing currency actions. Be practical. Write 2-3 paragraphs.",
  },
  actions: {
    label: "Action Plan",             icon: "⚡", color: "#F43F5E",
    desc:  "Prioritised 30-60-90 day action list",
    prompt: (c) => "You are a Finance Manager creating an action plan based on the financial data for " + c.reportingPeriod + ". Create a prioritised action list in three horizons: (1) Immediate (next 30 days) — urgent cash, overdue collections, pipeline actions, (2) Short-term (30-60 days) — operational improvements, cost controls, (3) Strategic (60-90 days) — structural improvements, growth initiatives. For each action, state who should own it (Finance, Sales, Operations, CEO) and what the expected impact is. Be specific to the numbers in the data.",
  },
};

// ── AI Insights Module ────────────────────────────────────────────
function AIInsightsModule({ gf }) {
  const { store } = useStore();
  const { fxRates, entities } = store;
  const periods = useMemo(() => (fxRates||[]).map(r => r.period), [fxRates]);

  const [activeInsight, setActiveInsight] = useState(null);
  const [results,       setResults]       = useState({});
  const [chatHistory,   setChatHistory]   = useState([]);
  const [chatInput,     setChatInput]     = useState("");
  const [chatLoading,   setChatLoading]   = useState(false);
  const [tab,           setTab]           = useState("insights");
  const [ctxError,      setCtxError]      = useState(null);
  const chatEndRef = useRef(null);

  // Build context with error handling
  const ctx = useMemo(() => {
    try {
      return buildAIContext(store, gf, periods);
    } catch(e) {
      setCtxError(e.message);
      return {
        reportingPeriod: periods[periods.length-1] || "—",
        priorPeriod: "—",
        entities: (store.entities||[]).filter(e=>e.active).map(e=>e.name),
        pl: { curRevenue:"—", prevRevenue:"—", revGrowth:"—", curProfit:"—", prevProfit:"—",
              profitGrowth:"—", gpMargin:"—", ytdRevenue:"—", ytdProfit:"—",
              topRevenueAccounts:[], vsRevenueBudget:"—" },
        byEntity: [],
        receivables: { totalOutstanding:"—", overdueAmount:"—", overdueCount:0, overdueRatio:"—", topOverdueDebtors:[], netExposure:"—" },
        payables: { totalOutstanding:"—", overdueAmount:"—", overdueCount:0 },
        sales: { wonRevenue:"—", pipelineValue:"—", weightedForecast:"—", winRate:"—",
                 totalDeals:0, wonDeals:0, activeDeals:0, topProductsByRevenue:[], dealsClosingSoon:[] },
        fxExposure: [],
        baseCurrency: "MYR",
      };
    }
  }, [store, gf, periods]);

  function buildSystem(context) {
    // Trim context to avoid token limits — send key metrics only
    const slim = {
      reportingPeriod:  context.reportingPeriod,
      priorPeriod:      context.priorPeriod,
      entities:         context.entities,
      pl:               context.pl,
      byEntity:         context.byEntity,
      receivables:      context.receivables,
      payables:         context.payables,
      sales: {
        wonRevenue:       context.sales?.wonRevenue,
        pipelineValue:    context.sales?.pipelineValue,
        weightedForecast: context.sales?.weightedForecast,
        winRate:          context.sales?.winRate,
        topProductsByRevenue: context.sales?.topProductsByRevenue,
        dealsClosingSoon: context.sales?.dealsClosingSoon,
      },
      fxExposure:       context.fxExposure,
      baseCurrency:     context.baseCurrency,
    };
    return "You are a senior Finance Manager for a multi-entity APAC business. " +
      "Be direct, specific with numbers, and always end with a concrete action. " +
      "APAC context: MYR base currency, entities in Malaysia, Singapore, Philippines. " +
      "Business data: " + JSON.stringify(slim);
  }

  async function runInsight(key) {
    setActiveInsight(key);
    setResults(r => ({ ...r, [key]: { text:"", loading:true, error:null } }));
    const promptFn = INSIGHT_PROMPTS[key].prompt;
    const userMsg  = promptFn(ctx);
    const MAX_TRIES = 3; // retries are for Groq rate limits only
    for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            max_tokens: 1000,
            messages: [
              { role: "system", content: buildSystem(ctx) },
              { role: "user",   content: userMsg },
            ],
          }),
        });
        const raw = await res.text();
        let data;
        try { data = JSON.parse(raw); } catch(pe) { throw new Error("Parse error: "+raw.slice(0,120)); }
        if (data.error) {
          // Groq TPM rate limit → wait the advised time and retry
          const m = /try again in ([\d.]+)s/i.exec(data.error?.message || "");
          if (m && attempt < MAX_TRIES) {
            const waitS = Math.min(Math.ceil(parseFloat(m[1])) + 2, 60);
            await new Promise(ok => setTimeout(ok, waitS * 1000));
            continue;
          }
          throw new Error(data.error?.message || JSON.stringify(data.error));
        }
        const text = data.content?.[0]?.text || data.choices?.[0]?.message?.content || "";
        if (!text) throw new Error("Empty response from Groq. Status: "+res.status);
        setResults(r => ({ ...r, [key]: { text, loading:false, error:null, ts: new Date().toLocaleTimeString() } }));
        return;
      } catch(e) {
        setResults(r => ({ ...r, [key]: { text:"", loading:false, error: e.message } }));
        return;
      }
    }
  }

  async function sendChat(msg) {
    if (!msg.trim()) return;
    const userMsg = msg.trim();
    setChatInput("");
    setChatLoading(true);

    const newHistory = [...chatHistory, { role:"user", content: userMsg }];
    setChatHistory(newHistory);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1000,
          messages: [
            { role: "system", content: buildSystem(ctx) },
            ...newHistory,
          ],
        }),
      });
      const raw = await res.text();
      let data;
      try { data = JSON.parse(raw); } catch(pe) { throw new Error("Parse error: "+raw.slice(0,120)); }
      if (data.error) throw new Error(data.error?.message || JSON.stringify(data.error));
      const text = data.content?.[0]?.text || data.choices?.[0]?.message?.content || "";
      if (!text) throw new Error("Empty response. Status: "+res.status);
      setChatHistory([...newHistory, { role:"assistant", content: text }]);
    } catch(e) {
      setChatHistory([...newHistory, { role:"assistant", content: `Error: ${e.message}` }]);
    }
    setChatLoading(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior:"smooth" }), 100);
  }

  // Suggested follow-up questions
  const SUGGESTIONS = [
    "Which entity should I focus on to improve overall group profitability?",
    "What is the biggest risk to our cash position in the next 30 days?",
    "Which deals in the pipeline are most likely to close and what is the expected impact on revenue?",
    "Compare our revenue mix this period vs prior period — what has changed?",
    "What should I tell the board about our FX exposure?",
    "Which cost lines are growing faster than revenue?",
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      {/* Context build error warning */}
      {ctxError && (
        <div style={{ background:`${P.orange}15`, border:`1px solid ${P.orange}40`, borderRadius:10, padding:"10px 16px", fontSize:12, color:P.orange }}>
          ⚠ Data context warning: {ctxError} — AI insights may be limited. Load data via Import Hub for full analysis.
        </div>
      )}
      <div style={{ background:`linear-gradient(135deg, ${P.surf3} 0%, ${P.surf2} 100%)`, border:`1px solid ${P.bord2}`, borderRadius:14, padding:"18px 22px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:`linear-gradient(135deg,${P.gold},${P.mag})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>✦</div>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:P.text }}>AI Biz Insight</div>
            <div style={{ fontSize:11, color:P.muted }}>Powered by Claude · Analysing {ctx.entities.length} entit{ctx.entities.length!==1?"ies":"y"} · Period: {ctx.reportingPeriod}</div>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", gap:8, flexWrap:"wrap" }}>
            {[
              ["Revenue", ctx.pl?.curRevenue||"—", P.green],
              ["Profit",  ctx.pl?.curProfit||"—",  (ctx.pl?.curProfit||"").startsWith("-")?P.red:P.green],
              ["Pipeline",ctx.sales?.pipelineValue||"—", P.blue],
            ].map(([l,v,c])=>(
              <div key={l} style={{ background:P.bg2, border:`1px solid ${c}30`, borderRadius:8, padding:"6px 12px", textAlign:"center" }}>
                <div style={{ color:P.muted, fontSize:9, fontWeight:700, letterSpacing:1.5 }}>{l.toUpperCase()}</div>
                <div style={{ color:c, fontFamily:"monospace", fontSize:13, fontWeight:700 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize:11, color:P.muted }}>
          The AI Finance Manager reads your loaded data — GL, Sales, AR/AP, FX — and provides narrative analysis exactly as a Finance Manager would present to the board. All insights are grounded in your actual numbers.
        </div>
      </div>

      {/* Tabs */}
      <SubTabs tabs={[{id:"insights",label:"Insight Cards"},{id:"chat",label:"💬 Ask Your FM"},{id:"context",label:"Data Context"}]} active={tab} onChange={setTab}/>

      {/* INSIGHT CARDS TAB */}
      {tab==="insights"&&(
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Card grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:10 }}>
            {Object.entries(INSIGHT_PROMPTS).map(([key, insight]) => {
              const res = results[key];
              const isActive = activeInsight === key;
              const isDone   = res && !res.loading && !res.error;
              return (
                <button key={key} onClick={() => runInsight(key)} style={{
                  background: isActive ? `${insight.color}18` : P.surf2,
                  border: `1px solid ${isActive ? insight.color : P.border}`,
                  borderRadius: 12, padding:"14px 16px", cursor:"pointer",
                  textAlign:"left", fontFamily:"inherit", transition:"all 0.15s",
                  position:"relative", overflow:"hidden",
                }}>
                  {isDone && <div style={{ position:"absolute", top:8, right:10, width:6, height:6, borderRadius:"50%", background:P.green }}/>}
                  {res?.loading && <div style={{ position:"absolute", top:8, right:10, width:6, height:6, borderRadius:"50%", background:P.gold, animation:"pulse 1s infinite" }}/>}
                  <div style={{ fontSize:20, marginBottom:6 }}>{insight.icon}</div>
                  <div style={{ color:insight.color, fontWeight:700, fontSize:12, marginBottom:3 }}>{insight.label}</div>
                  <div style={{ color:P.muted, fontSize:10, lineHeight:1.4 }}>{insight.desc}</div>
                  {res?.ts && <div style={{ color:P.muted, fontSize:9, marginTop:6 }}>Generated {res.ts}</div>}
                </button>
              );
            })}
          </div>

          {/* Run all */}
          <div style={{ display:"flex", gap:8 }}>
            <Btn onClick={async()=>{
              // Sequential with spacing — keeps within Groq free-tier TPM.
              for(const k of Object.keys(INSIGHT_PROMPTS)){
                await runInsight(k);
                await new Promise(ok=>setTimeout(ok,1500));
              }
            }} color={P.gold}>
              ✦ Generate All Insights
            </Btn>
            <Btn onClick={()=>{setResults({});setActiveInsight(null);}} outline color={P.muted} small>Clear</Btn>
          </div>

          {/* Active insight result */}
          {activeInsight && results[activeInsight] && (
            <div style={{ background:P.surface, border:`1px solid ${INSIGHT_PROMPTS[activeInsight].color}40`, borderRadius:14, overflow:"hidden" }}>
              {/* Insight header */}
              <div style={{ background:`${INSIGHT_PROMPTS[activeInsight].color}15`, padding:"14px 20px", borderBottom:`1px solid ${INSIGHT_PROMPTS[activeInsight].color}30`, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:20 }}>{INSIGHT_PROMPTS[activeInsight].icon}</span>
                <div>
                  <div style={{ color:INSIGHT_PROMPTS[activeInsight].color, fontWeight:700, fontSize:14 }}>{INSIGHT_PROMPTS[activeInsight].label}</div>
                  <div style={{ color:P.muted, fontSize:10 }}>{ctx.reportingPeriod} · {ctx.entities.length} entit{ctx.entities.length!==1?"ies":"y"}</div>
                </div>
                {results[activeInsight].ts && <div style={{ marginLeft:"auto", color:P.muted, fontSize:10 }}>Generated {results[activeInsight].ts}</div>}
              </div>

              {/* Content */}
              <div style={{ padding:"20px 22px", minHeight:120 }}>
                {results[activeInsight].loading && (
                  <div style={{ display:"flex", alignItems:"center", gap:12, color:P.muted }}>
                    <div style={{ width:20, height:20, border:`2px solid ${P.border}`, borderTopColor:P.gold, borderRadius:"50%", animation:"spin 0.8s linear infinite", flexShrink:0 }}/>
                    <span style={{ fontSize:13 }}>Your Finance Manager is analysing the data…</span>
                  </div>
                )}
                {results[activeInsight].error && (
                  <div style={{ color:P.red, fontSize:12 }}>✗ {results[activeInsight].error}</div>
                )}
                {results[activeInsight].text && (
                  <div style={{ color:P.text, fontSize:13, lineHeight:1.8, whiteSpace:"pre-wrap" }}>
                    {results[activeInsight].text}
                  </div>
                )}
              </div>

              {/* Follow-up chip */}
              {results[activeInsight].text && (
                <div style={{ padding:"10px 20px 16px", borderTop:`1px solid ${P.border}20` }}>
                  <div style={{ color:P.muted, fontSize:10, marginBottom:6 }}>Ask a follow-up</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {SUGGESTIONS.slice(0,3).map(s=>(
                      <button key={s} onClick={()=>{setTab("chat");setTimeout(()=>sendChat(s),100);}} style={{
                        background:P.surf2, border:`1px solid ${P.border}`, borderRadius:20,
                        color:P.sub, fontSize:10, padding:"4px 12px", cursor:"pointer", fontFamily:"inherit",
                        textAlign:"left", maxWidth:280, whiteSpace:"normal", lineHeight:1.4,
                      }}>{s}</button>
                    ))}
                    <button onClick={()=>setTab("chat")} style={{ background:`${P.gold}20`, border:`1px solid ${P.gold}40`, borderRadius:20, color:P.gold, fontSize:10, padding:"4px 12px", cursor:"pointer", fontFamily:"inherit" }}>
                      Open chat →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CHAT TAB */}
      {tab==="chat"&&(
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ background:P.surf2, border:`1px solid ${P.border}`, borderRadius:12, padding:"10px 16px", fontSize:11, color:P.muted }}>
            Ask your AI Biz Insight anything about the loaded data. It has full context of your P&L, sales pipeline, AR/AP, FX exposure and entity breakdown.
          </div>

          {/* Suggested questions */}
          {chatHistory.length === 0 && (
            <div>
              <div style={{ color:P.muted, fontSize:10, fontWeight:700, letterSpacing:1.5, marginBottom:8 }}>SUGGESTED QUESTIONS</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {SUGGESTIONS.map(s=>(
                  <button key={s} onClick={()=>sendChat(s)} style={{
                    background:P.surf2, border:`1px solid ${P.border}`, borderRadius:10,
                    color:P.sub, fontSize:11, padding:"6px 14px", cursor:"pointer",
                    fontFamily:"inherit", textAlign:"left", lineHeight:1.4,
                  }}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Chat messages */}
          {chatHistory.length > 0 && (
            <div style={{ background:P.surf2, borderRadius:12, border:`1px solid ${P.border}`, padding:"16px", maxHeight:480, overflowY:"auto", display:"flex", flexDirection:"column", gap:14 }}>
              {chatHistory.map((msg, i) => (
                <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", flexDirection: msg.role==="user" ? "row-reverse" : "row" }}>
                  <div style={{
                    width:28, height:28, borderRadius:8, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800,
                    background: msg.role==="user" ? `linear-gradient(135deg,${P.blue}80,${P.purple}80)` : `linear-gradient(135deg,${P.gold},${P.mag})`,
                    color:"#0B0F1A",
                  }}>
                    {msg.role==="user" ? "U" : "✦"}
                  </div>
                  <div style={{
                    background: msg.role==="user" ? `${P.blue}20` : P.surface,
                    border: `1px solid ${msg.role==="user" ? P.blue+"40" : P.border}`,
                    borderRadius: msg.role==="user" ? "12px 2px 12px 12px" : "2px 12px 12px 12px",
                    padding:"11px 15px", maxWidth:"78%",
                    color:P.text, fontSize:12, lineHeight:1.75, whiteSpace:"pre-wrap",
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:`linear-gradient(135deg,${P.gold},${P.mag})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"#0B0F1A", flexShrink:0 }}>✦</div>
                  <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                    {[0,1,2].map(i=><div key={i} style={{ width:6, height:6, borderRadius:"50%", background:P.gold, animation:`bounce 0.8s ${i*0.15}s infinite` }}/>)}
                  </div>
                </div>
              )}
              <div ref={chatEndRef}/>
            </div>
          )}

          {/* Input */}
          <div style={{ display:"flex", gap:8 }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key==="Enter" && !e.shiftKey && sendChat(chatInput)}
              placeholder="Ask AI Biz Insight… (e.g. Why did revenue drop in Singapore?)"
              style={{ flex:1, background:P.surf2, border:`1px solid ${P.border}`, borderRadius:10, color:P.text, padding:"11px 16px", fontSize:13, outline:"none", fontFamily:"inherit" }}
            />
            <Btn onClick={()=>sendChat(chatInput)} disabled={!chatInput.trim()||chatLoading} color={P.gold}>Send →</Btn>
          </div>

          {chatHistory.length > 0 && (
            <button onClick={()=>setChatHistory([])} style={{ background:"transparent", border:`1px solid ${P.border}`, borderRadius:7, color:P.muted, cursor:"pointer", fontSize:11, padding:"5px 12px", fontFamily:"inherit", alignSelf:"flex-start" }}>Clear conversation</button>
          )}
        </div>
      )}

      {/* CONTEXT TAB — show what the AI sees */}
      {tab==="context"&&(
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ background:P.surf2, borderRadius:10, padding:"10px 14px", fontSize:11, color:P.muted, border:`1px solid ${P.border}` }}>
            This is the data context sent to the AI — a computed summary of your financials. Raw records are never sent; only aggregated metrics. This keeps token usage efficient and avoids sending sensitive transaction details.
          </div>
          <div style={{ background:"#0B1525", border:`1px solid ${P.border}`, borderRadius:12, padding:"16px 20px", overflowX:"auto" }}>
            <pre style={{ color:"#22D3A0", fontSize:11, fontFamily:"Courier New", lineHeight:1.6, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
              {JSON.stringify(ctx, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* CSS keyframes */}
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// NEW MODULES — Priority 1-6
// ══════════════════════════════════════════════════════════════════

// ── Default data ──────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════
// FinFlow — 6 New Operational Finance Modules
// Priority order: WC KPIs → Rolling Forecast → Close Tracker →
//                 Report Pack → Fixed Assets → Headcount
// ══════════════════════════════════════════════════════════════════

// ── Default data for new store keys ──────────────────────────────
const DEFAULT_CLOSE_TASKS = [
  // Dec 2024 close
  {id:"CT001",entityId:"E001",period:"Dec 2024",category:"Bank",task:"Reconcile all bank accounts",responsible:"Finance",dueDay:3,done:true},
  {id:"CT002",entityId:"E001",period:"Dec 2024",category:"AR",task:"Confirm AR balances with clients",responsible:"Finance",dueDay:4,done:true},
  {id:"CT003",entityId:"E001",period:"Dec 2024",category:"AP",task:"Post all supplier invoices",responsible:"Finance",dueDay:4,done:true},
  {id:"CT004",entityId:"E001",period:"Dec 2024",category:"Accruals",task:"Post month-end accruals",responsible:"Finance",dueDay:5,done:false},
  {id:"CT005",entityId:"E001",period:"Dec 2024",category:"IC",task:"Confirm IC balances with SG office",responsible:"Finance",dueDay:5,done:true},
  {id:"CT006",entityId:"E001",period:"Dec 2024",category:"Payroll",task:"Post payroll journals",responsible:"HR/Finance",dueDay:3,done:true},
  {id:"CT007",entityId:"E001",period:"Dec 2024",category:"Fixed Assets",task:"Post depreciation journals",responsible:"Finance",dueDay:6,done:false},
  {id:"CT008",entityId:"E001",period:"Dec 2024",category:"Tax",task:"Calculate income tax provision",responsible:"Finance",dueDay:8,done:false},
  {id:"CT009",entityId:"E001",period:"Dec 2024",category:"Review",task:"CFO review of management accounts",responsible:"CFO",dueDay:10,done:false},
  {id:"CT010",entityId:"E001",period:"Dec 2024",category:"Reporting",task:"Distribute board pack",responsible:"Finance",dueDay:12,done:false},
  {id:"CT011",entityId:"E002",period:"Dec 2024",category:"Bank",task:"Reconcile SGD bank account",responsible:"Finance",dueDay:3,done:true},
  {id:"CT012",entityId:"E002",period:"Dec 2024",category:"Payroll",task:"Post payroll journals",responsible:"HR/Finance",dueDay:3,done:true},
  {id:"CT013",entityId:"E002",period:"Dec 2024",category:"IC",task:"Confirm IC fee payable to HQ",responsible:"Finance",dueDay:5,done:true},
  {id:"CT014",entityId:"E002",period:"Dec 2024",category:"Accruals",task:"Post office rental accrual",responsible:"Finance",dueDay:5,done:false},
  {id:"CT015",entityId:"E002",period:"Dec 2024",category:"Review",task:"Country head sign-off",responsible:"Country Head",dueDay:10,done:false},
  {id:"CT016",entityId:"E003",period:"Dec 2024",category:"Bank",task:"Reconcile PHP bank account",responsible:"Finance",dueDay:3,done:true},
  {id:"CT017",entityId:"E003",period:"Dec 2024",category:"Payroll",task:"Post payroll journals",responsible:"HR/Finance",dueDay:3,done:false},
  {id:"CT018",entityId:"E003",period:"Dec 2024",category:"Review",task:"Country head sign-off",responsible:"Country Head",dueDay:10,done:false},
  {id:"CT019",entityId:"E003",period:"Dec 2024",category:"Reporting",task:"Submit to HQ",responsible:"Finance",dueDay:11,done:false},
];

const CLOSE_CATEGORIES = ["Bank","AR","AP","Accruals","IC","Payroll","Fixed Assets","Tax","Review","Reporting"];
const CLOSE_CAT_CLR = {Bank:P.blue,AR:P.green,AP:P.mag,Accruals:P.gold,IC:P.orange,Payroll:P.purple,["Fixed Assets"]:P.blue,Tax:P.red,Review:P.gold,Reporting:P.green};

const DEFAULT_ASSETS = [
  {id:"FA001",entityId:"E001",name:"Office Renovation — KL HQ",category:"Leasehold Improvements",cost:85000,currency:"MYR",purchaseDate:"2022-01-01",usefulLife:5,residual:0,active:true,notes:"KL office fit-out"},
  {id:"FA002",entityId:"E001",name:"IT Equipment — Laptops x10",category:"IT Equipment",cost:38000,currency:"MYR",purchaseDate:"2023-06-01",usefulLife:3,residual:2000,active:true,notes:"Staff laptops"},
  {id:"FA003",entityId:"E001",name:"Training Room Furniture",category:"Furniture & Fittings",cost:22000,currency:"MYR",purchaseDate:"2022-01-01",usefulLife:5,residual:2000,active:true,notes:""},
  {id:"FA004",entityId:"E002",name:"Singapore Office Fit-Out",category:"Leasehold Improvements",cost:45000,currency:"SGD",purchaseDate:"2023-01-01",usefulLife:5,residual:0,active:true,notes:"Raffles Place office"},
  {id:"FA005",entityId:"E002",name:"Video Conferencing System",category:"IT Equipment",cost:12000,currency:"SGD",purchaseDate:"2023-03-01",usefulLife:4,residual:1000,active:true,notes:""},
  {id:"FA006",entityId:"E003",name:"Manila Office Equipment",category:"Office Equipment",cost:350000,currency:"PHP",purchaseDate:"2023-09-01",usefulLife:5,residual:20000,active:true,notes:""},
];

const ASSET_CATEGORIES = ["IT Equipment","Furniture & Fittings","Office Equipment","Leasehold Improvements","Motor Vehicles","Plant & Machinery","Other"];

const DEFAULT_HEADCOUNT = [
  {id:"HC001",entityId:"E001",name:"Lawrence Liu",title:"Managing Director",department:"Management",grade:"MD",costCentre:"Management",salary:18000,currency:"MYR",startDate:"2018-01-01",employmentType:"Full-time",active:true},
  {id:"HC002",entityId:"E001",name:"Finance Manager",title:"Finance Manager",department:"Finance",grade:"Manager",costCentre:"Finance",salary:8500,currency:"MYR",startDate:"2021-03-01",employmentType:"Full-time",active:true},
  {id:"HC003",entityId:"E001",name:"Senior Consultant",title:"Senior Consultant",department:"Consulting",grade:"Senior",costCentre:"Operations",salary:7200,currency:"MYR",startDate:"2020-06-01",employmentType:"Full-time",active:true},
  {id:"HC004",entityId:"E001",name:"Consultant",title:"Consultant",department:"Consulting",grade:"Executive",costCentre:"Operations",salary:4800,currency:"MYR",startDate:"2022-09-01",employmentType:"Full-time",active:true},
  {id:"HC005",entityId:"E001",name:"Admin Executive",title:"Admin Executive",department:"Administration",grade:"Executive",costCentre:"Admin",salary:3200,currency:"MYR",startDate:"2023-01-01",employmentType:"Full-time",active:true},
  {id:"HC006",entityId:"E002",name:"Country Head — SG",title:"Country Head",department:"Management",grade:"Director",costCentre:"Management",salary:14000,currency:"SGD",startDate:"2020-01-01",employmentType:"Full-time",active:true},
  {id:"HC007",entityId:"E002",name:"Consultant SG",title:"Consultant",department:"Consulting",grade:"Senior",costCentre:"Operations",salary:7500,currency:"SGD",startDate:"2022-04-01",employmentType:"Full-time",active:true},
  {id:"HC008",entityId:"E003",name:"Country Head — PH",title:"Country Head",department:"Management",grade:"Director",costCentre:"Management",salary:120000,currency:"PHP",startDate:"2021-07-01",employmentType:"Full-time",active:true},
];

const EMPLOYMENT_TYPES = ["Full-time","Part-time","Contract","Intern"];
const DEPARTMENTS      = ["Management","Finance","Consulting","Training","Operations","Administration","Sales","HR"];
const GRADES           = ["MD","Director","Manager","Senior","Executive","Associate","Intern"];

// ── Shared month label helper ─────────────────────────────────────
function isoToMonLabel(iso){
  if(!iso) return "";
  const [y,m]=iso.split("-");
  const mon=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(m)-1];
  return mon+" "+y;
}
function periodToISODate(period){
  const months={Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12"};
  const [mon,yr]=period.split(" ");
  return yr+"-"+(months[mon]||"01")+"-28";
}

// ══════════════════════════════════════════════════════════════════
// MODULE 1: WORKING CAPITAL KPIs
// ══════════════════════════════════════════════════════════════════
function WorkingCapitalModule({gf}){
  const {store}=useStore();
  const {ar,ap,gl,coa,entities,fxRates,sales=[]}=store;
  const periods=fxRates.map(r=>r.period);
  const lastTwo=periods.slice(-2);
  const [cP1,setCP1]=useState(lastTwo[0]||periods[0]||"");
  const [cP2,setCP2]=useState(lastTwo[1]||periods[periods.length-1]||"");
  const [tab,setTab]=useState("kpis");

  const spotRow=fxRates[fxRates.length-1]||{};
  function toRM(amt,ccy){
    if(!amt)return 0;
    if(ccy===BASE)return amt;
    if(ccy==="USD")return amt*(spotRow.MYR||4.5);
    const r=spotRow[ccy],m=spotRow.MYR;
    return(r&&m)?amt*(m/r):amt;
  }

  // GL revenue for a period/entities (for DSO denominator)
  function getRevenue(period,eids){
    return gl.filter(j=>eids.includes(j.entityId)&&j.period===period).reduce((s,j)=>{
      const a=coa.find(x=>x.code===j.crAccount);
      if(a?.class==="R"){const e=entities.find(x=>x.id===j.entityId);return s+j.amount*toRM(1,e?.currency||BASE);}
      return s;
    },0);
  }
  function getExpense(period,eids){
    return gl.filter(j=>eids.includes(j.entityId)&&j.period===period).reduce((s,j)=>{
      const a=coa.find(x=>x.code===j.drAccount);
      if(a?.class==="X"&&a.code==="5000"){const e=entities.find(x=>x.id===j.entityId);return s+j.amount*toRM(1,e?.currency||BASE);}
      return s;
    },0);
  }

  function calcKPIs(period,eids){
    const filtAR=ar.filter(r=>eids.includes(r.entityId)&&r.status!=="Paid");
    const filtAP=ap.filter(r=>eids.includes(r.entityId)&&r.status!=="Paid");
    const arBal=filtAR.reduce((s,r)=>s+toRM(r.amount,r.currency),0);
    const apBal=filtAP.reduce((s,r)=>s+toRM(r.amount,r.currency),0);
    const rev=getRevenue(period,eids)||1;
    const cogs=getExpense(period,eids)||rev*0.4;
    const dso=arBal>0?(arBal/(rev/30)):0;
    const dpo=apBal>0?(apBal/(cogs/30)):0;
    const dio=0; // inventory not tracked — show as 0
    const ccc=dso+dio-dpo;
    const arOvd=filtAR.filter(r=>r.status==="Overdue").reduce((s,r)=>s+toRM(r.amount,r.currency),0);
    const ovdRatio=arBal>0?(arOvd/arBal*100):0;
    return{arBal,apBal,rev,dso,dpo,dio,ccc,arOvd,ovdRatio,netWC:arBal-apBal};
  }

  const k2=useMemo(()=>calcKPIs(cP2,gf.entityIds),[ar,ap,gl,cP2,gf.entityIds]);
  const k1=useMemo(()=>calcKPIs(cP1,gf.entityIds),[ar,ap,gl,cP1,gf.entityIds]);

  // Entity breakdown
  const activeE=entities.filter(e=>e.active&&gf.entityIds.includes(e.id));
  const entityKPIs=activeE.map(e=>{
    const k=calcKPIs(cP2,[e.id]);
    return{...e,...k};
  });

  // Trend
  const trend=periods.map(p=>{
    const k=calcKPIs(p,gf.entityIds);
    return{period:p,dso:+k.dso.toFixed(1),dpo:+k.dpo.toFixed(1),ccc:+k.ccc.toFixed(1),ar:k.arBal,ap:k.apBal};
  }).filter(d=>d.ar>0||d.ap>0);

  const dsoColor=k2.dso>60?P.red:k2.dso>45?P.orange:P.green;
  const dpoColor=k2.dpo>60?P.green:k2.dpo>30?P.gold:P.orange;
  const cccColor=k2.ccc>60?P.red:k2.ccc>30?P.orange:P.green;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <PeriodComparePicker periods={periods} p1={cP1} p2={cP2} onP1={setCP1} onP2={setCP2} label1="Prior" label2="Current"/>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        <KPI label="DSO (Days)" value={k2.dso.toFixed(1)+"d"} color={dsoColor} accent={dsoColor} small sub={<Delta current={k2.dso} previous={k1.dso} invert/>}/>
        <KPI label="DPO (Days)" value={k2.dpo.toFixed(1)+"d"} color={dpoColor} accent={dpoColor} small sub={<Delta current={k2.dpo} previous={k1.dpo}/>}/>
        <KPI label="CCC (Days)" value={k2.ccc.toFixed(1)+"d"} color={cccColor} accent={cccColor} small sub="DSO − DPO"/>
        <KPI label="AR Balance"  value={fmtK(k2.arBal)} color={P.green}  small sub={<Delta current={k2.arBal} previous={k1.arBal}/>}/>
        <KPI label="AP Balance"  value={fmtK(k2.apBal)} color={P.mag}    small sub={<Delta current={k2.apBal} previous={k1.apBal}/>}/>
        <KPI label="Net WC"      value={fmtK(k2.netWC)} color={k2.netWC>=0?P.green:P.red} small/>
        <KPI label="Overdue AR"  value={fmtK(k2.arOvd)} color={P.red}   small sub={k2.ovdRatio.toFixed(0)+"%"}/>
      </div>

      <SubTabs tabs={[{id:"kpis",label:"KPI Dashboard"},{id:"trend",label:"Trend"},{id:"entity",label:"By Entity"},{id:"insights",label:"📊 Insights"}]} active={tab} onChange={setTab}/>

      {tab==="kpis"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {/* CCC breakdown visual */}
          <Card title="Cash Conversion Cycle Breakdown" accent={P.gold}>
            <div style={{display:"flex",alignItems:"center",gap:0,flexWrap:"wrap",marginBottom:14}}>
              {[["DSO",k2.dso,dsoColor,"Collect from customers"],["DIO",k2.dio,P.blue,"Inventory held"],["DPO",k2.dpo,dpoColor,"Pay suppliers"]].map((item,i)=>(
                <div key={item[0]} style={{display:"flex",alignItems:"center"}}>
                  <div style={{textAlign:"center",padding:"0 16px"}}>
                    <div style={{color:item[2],fontSize:28,fontWeight:800,fontFamily:"monospace"}}>{item[1].toFixed(0)}<span style={{fontSize:14,color:P.muted}}>d</span></div>
                    <div style={{color:item[2],fontSize:11,fontWeight:700,marginTop:2}}>{item[0]}</div>
                    <div style={{color:P.muted,fontSize:9,marginTop:2}}>{item[3]}</div>
                  </div>
                  {i<2&&<div style={{color:P.muted,fontSize:18}}>{i===0?"+":(i===1?"−":"")}</div>}
                </div>
              ))}
              <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:8}}>
                <div style={{color:P.muted,fontSize:18}}>=</div>
                <div style={{textAlign:"center",padding:"0 16px",background:P.surf2,borderRadius:10,border:`2px solid ${cccColor}`,padding:"12px 20px"}}>
                  <div style={{color:cccColor,fontSize:32,fontWeight:800,fontFamily:"monospace"}}>{k2.ccc.toFixed(0)}<span style={{fontSize:14,color:P.muted}}>d</span></div>
                  <div style={{color:cccColor,fontSize:11,fontWeight:700,marginTop:2}}>CCC</div>
                  <div style={{color:P.muted,fontSize:9,marginTop:2}}>Cash Conversion Cycle</div>
                </div>
              </div>
            </div>
            <div style={{fontSize:11,color:P.muted,background:P.surf2,borderRadius:8,padding:"8px 12px"}}>
              <strong style={{color:k2.ccc<30?P.green:k2.ccc<60?P.gold:P.red}}>
                {k2.ccc<30?"✓ Healthy":"⚠ Needs attention"}:
              </strong> {k2.ccc<30?" Cash cycle is efficient. Collecting faster than paying.":k2.ccc<60?" Moderate cycle. Focus on reducing DSO below 30 days.":" Long cash cycle. Business is funding customers. Prioritise collection and extend payables."}
            </div>
          </Card>

          {/* Period comparison table */}
          <Card noPad title={"Period Comparison — "+cP1+" vs "+cP2}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:P.surf2}}>{["Metric",cP1,cP2,"Change","Interpretation"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1}}>{h}</th>)}</tr></thead>
              <tbody>{[
                {label:"DSO",v1:k1.dso,v2:k2.dso,unit:"d",good:"lower",note:"Days to collect AR"},
                {label:"DPO",v1:k1.dpo,v2:k2.dpo,unit:"d",good:"higher",note:"Days before paying suppliers"},
                {label:"CCC",v1:k1.ccc,v2:k2.ccc,unit:"d",good:"lower",note:"Net cash cycle"},
                {label:"AR Balance",v1:k1.arBal,v2:k2.arBal,unit:"RM",good:"neutral",note:"Outstanding receivables"},
                {label:"AP Balance",v1:k1.apBal,v2:k2.apBal,unit:"RM",good:"neutral",note:"Outstanding payables"},
                {label:"Net Working Capital",v1:k1.netWC,v2:k2.netWC,unit:"RM",good:"higher",note:"AR minus AP"},
                {label:"Overdue Ratio",v1:k1.ovdRatio,v2:k2.ovdRatio,unit:"%",good:"lower",note:"% of AR that is overdue"},
              ].map((r,i)=>{
                const up=r.v2>r.v1;
                const good=r.good==="higher"?up:r.good==="lower"?!up:null;
                const chg=r.v1!==0?((r.v2-r.v1)/Math.abs(r.v1)*100):0;
                return(<tr key={r.label} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}12`}}>
                  <td style={{padding:"7px 10px",color:P.text,fontWeight:600}}>{r.label}</td>
                  <td style={{padding:"7px 10px",fontFamily:"monospace",color:P.sub}}>{r.unit==="RM"?fmtMYR(r.v1):r.v1.toFixed(r.unit==="%"?1:0)+r.unit}</td>
                  <td style={{padding:"7px 10px",fontFamily:"monospace",color:P.text,fontWeight:700}}>{r.unit==="RM"?fmtMYR(r.v2):r.v2.toFixed(r.unit==="%"?1:0)+r.unit}</td>
                  <td style={{padding:"7px 10px",color:good===null?P.muted:good?P.green:P.red,fontSize:10,fontWeight:600}}>{chg!==0?(up?"▲":"▼")+Math.abs(chg).toFixed(1)+"%":"—"}</td>
                  <td style={{padding:"7px 10px",color:P.muted,fontSize:10}}>{r.note}</td>
                </tr>);
              })}</tbody>
            </table>
          </Card>
        </div>
      )}

      {tab==="trend"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <InsightPanel title="DSO, DPO & CCC Trend (Days)">
            <div style={{fontSize:10,color:P.muted,marginBottom:8}}>Target: DSO &lt; 30 days · DPO &gt; 30 days · CCC &lt; 30 days</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trend} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="period" tick={{fill:P.muted,fontSize:9}}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>v+"d"}/>
                <ReferenceLine y={30} stroke={P.green} strokeDasharray="4 4" label={{value:"30d target",fill:P.green,fontSize:9}}/>
                <Tooltip formatter={v=>v.toFixed(1)+"d"} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Legend formatter={v=><span style={{color:P.muted,fontSize:11}}>{v}</span>}/>
                <Line type="monotone" dataKey="dso" name="DSO" stroke={dsoColor} strokeWidth={2} dot={{r:3}}/>
                <Line type="monotone" dataKey="dpo" name="DPO" stroke={dpoColor} strokeWidth={2} dot={{r:3}}/>
                <Line type="monotone" dataKey="ccc" name="CCC" stroke={P.gold}   strokeWidth={2} dot={{r:3}} strokeDasharray="5 3"/>
              </LineChart>
            </ResponsiveContainer>
          </InsightPanel>
          <InsightPanel title="AR vs AP Balance Trend (MYR)">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={trend} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="period" tick={{fill:P.muted,fontSize:9}}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Legend formatter={v=><span style={{color:P.muted,fontSize:11}}>{v}</span>}/>
                <Bar dataKey="ar" name="AR Balance" fill={P.green} radius={[3,3,0,0]}/>
                <Bar dataKey="ap" name="AP Balance" fill={P.mag}   radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </InsightPanel>
        </div>
      )}

      {tab==="entity"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
          {entityKPIs.map(e=>{
            const dc=e.dso>60?P.red:e.dso>45?P.orange:P.green;
            return(
              <Card key={e.id} accent={e.color}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><EntityDot entity={e} size={8}/><span style={{color:e.color,fontWeight:700,fontSize:13}}>{e.name}</span></div>
                {[["DSO",e.dso.toFixed(1)+"d",dc],["DPO",e.dpo.toFixed(1)+"d",dpoColor],["CCC",e.ccc.toFixed(1)+"d",e.ccc<30?P.green:P.red],["AR",fmtK(e.arBal),P.green],["AP",fmtK(e.apBal),P.mag],["Net WC",fmtK(e.netWC),e.netWC>=0?P.green:P.red]].map(([l,v,c])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${P.border}20`}}>
                    <span style={{color:P.muted,fontSize:11}}>{l}</span>
                    <span style={{color:c,fontFamily:"monospace",fontSize:12,fontWeight:700}}>{v}</span>
                  </div>
                ))}
              </Card>
            );
          })}
        </div>
      )}

      {tab==="insights"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <InsightPanel title="Working Capital Health Score">
            {(()=>{
              const score=Math.max(0,Math.min(100,100-(k2.dso-30)*1.5-(k2.ccc>0?k2.ccc*0.5:0)+(k2.dpo>30?15:0)));
              const color=score>70?P.green:score>50?P.gold:P.red;
              return(
                <div style={{display:"flex",alignItems:"center",gap:24}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:52,fontWeight:800,color,fontFamily:"monospace",lineHeight:1}}>{Math.round(score)}</div>
                    <div style={{color:P.muted,fontSize:10,marginTop:4}}>/100</div>
                    <div style={{color,fontSize:12,fontWeight:700,marginTop:4}}>{score>70?"Healthy":score>50?"Monitor":"Critical"}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{height:8,background:P.border,borderRadius:4,overflow:"hidden",marginBottom:8}}>
                      <div style={{height:"100%",width:score+"%",background:`linear-gradient(90deg,${P.red},${P.gold},${P.green})`,borderRadius:4}}/>
                    </div>
                    {[["DSO "+k2.dso.toFixed(0)+"d",k2.dso<30?"✓ Under 30 day target":"✗ Above 30 day target",k2.dso<30?P.green:P.red],
                      ["CCC "+k2.ccc.toFixed(0)+"d",k2.ccc<30?"✓ Efficient cycle":"⚠ Cycle needs improvement",k2.ccc<30?P.green:P.orange],
                      ["DPO "+k2.dpo.toFixed(0)+"d",k2.dpo>30?"✓ Holding payables well":"⚠ Paying suppliers too fast",k2.dpo>30?P.green:P.orange],
                      ["Overdue "+k2.ovdRatio.toFixed(0)+"%",k2.ovdRatio<20?"✓ Manageable overdue ratio":"✗ High overdue AR — chase collections",k2.ovdRatio<20?P.green:P.red],
                    ].map(([l,note,c])=>(
                      <div key={l} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:5}}>
                        <span style={{color:c,fontFamily:"monospace",fontSize:11,fontWeight:700,flexShrink:0,width:80}}>{l}</span>
                        <span style={{color:P.muted,fontSize:10}}>{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </InsightPanel>
          <InsightPanel title="Period Comparison — Working Capital">
            <PeriodComparePicker periods={periods} p1={cP1} p2={cP2} onP1={setCP1} onP2={setCP2}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
              {[[cP1,k1],[cP2,k2]].map(([p,k])=>(
                <div key={p} style={{background:P.surf2,borderRadius:10,padding:"14px"}}>
                  <div style={{color:P.gold,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:10}}>{p}</div>
                  {[["DSO",k.dso.toFixed(1)+"d",k.dso<30?P.green:P.red],["DPO",k.dpo.toFixed(1)+"d",k.dpo>30?P.green:P.orange],["CCC",k.ccc.toFixed(1)+"d",k.ccc<30?P.green:P.red]].map(([l,v,c])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${P.border}20`}}>
                      <span style={{color:P.muted,fontSize:11}}>{l}</span>
                      <span style={{color:c,fontFamily:"monospace",fontSize:12,fontWeight:700}}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </InsightPanel>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MODULE 2: ROLLING 13-WEEK CASH FORECAST
// ══════════════════════════════════════════════════════════════════
function RollingForecastModule({gf}){
  const {store}=useStore();
  const {ar,ap,sales=[],fxRates,entities}=store;
  const [tab,setTab]=useState("forecast");
  const [baseDate,setBaseDate]=useState(new Date().toISOString().slice(0,10));
  const spotRow=fxRates[fxRates.length-1]||{};

  function toRM(amt,ccy){
    if(!amt)return 0;if(ccy===BASE)return amt;
    if(ccy==="USD")return amt*(spotRow.MYR||4.5);
    const r=spotRow[ccy],m=spotRow.MYR;return(r&&m)?amt*(m/r):amt;
  }

  // Build 13 weekly buckets from baseDate
  const weeks=useMemo(()=>{
    const base=new Date(baseDate);
    return Array.from({length:13},(_,i)=>{
      const start=new Date(base);start.setDate(base.getDate()+i*7);
      const end=new Date(start);end.setDate(start.getDate()+6);
      const label="Wk "+(i+1)+" "+start.toLocaleDateString("en-MY",{day:"2-digit",month:"short"});
      return{week:i+1,label,start:start.toISOString().slice(0,10),end:end.toISOString().slice(0,10)};
    });
  },[baseDate]);

  // Allocate AR collections by due date
  function getARInflows(week){
    return ar.filter(r=>{
      if(!gf.entityIds.includes(r.entityId))return false;
      if(r.status==="Paid")return false;
      const due=r.dueDate||"";
      return due>=week.start&&due<=week.end;
    }).reduce((s,r)=>s+toRM(r.amount,r.currency)*0.85,0); // 85% collection assumption
  }

  // Allocate AP payments by due date
  function getAPOutflows(week){
    return ap.filter(r=>{
      if(!gf.entityIds.includes(r.entityId))return false;
      if(r.status==="Paid")return false;
      const due=r.dueDate||"";
      return due>=week.start&&due<=week.end;
    }).reduce((s,r)=>s+toRM(r.amount,r.currency),0);
  }

  // Weighted pipeline revenue expected this week
  function getPipelineInflows(week){
    return sales.filter(d=>{
      if(!gf.entityIds.includes(d.entityId))return false;
      if(["Won","Lost"].includes(d.stage))return false;
      const close=d.closeDate||"";
      return close>=week.start&&close<=week.end;
    }).reduce((s,d)=>{
      const prob={Lead:0.1,Qualified:0.25,Proposal:0.5,Negotiation:0.75}[d.stage]||0;
      return s+toRM(d.value,d.currency)*prob;
    },0);
  }

  const forecastData=weeks.map(week=>{
    const arIn=getARInflows(week);
    const pipIn=getPipelineInflows(week);
    const apOut=getAPOutflows(week);
    const netFlow=arIn+pipIn-apOut;
    return{...week,arInflows:arIn,pipelineInflows:pipIn,apOutflows:apOut,netFlow};
  });

  // Running cumulative cash position
  let running=0;
  const withCumulative=forecastData.map(w=>{running+=w.netFlow;return{...w,cumulative:running};});

  const totalIn=forecastData.reduce((s,w)=>s+w.arInflows+w.pipelineInflows,0);
  const totalOut=forecastData.reduce((s,w)=>s+w.apOutflows,0);
  const netPos=totalIn-totalOut;
  const worstWeek=forecastData.reduce((a,b)=>b.netFlow<a.netFlow?b:a,forecastData[0]||{});
  const bestWeek=forecastData.reduce((a,b)=>b.netFlow>a.netFlow?b:a,forecastData[0]||{});

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Base date */}
      <div style={{display:"flex",gap:10,alignItems:"center",background:P.surf2,borderRadius:10,padding:"10px 14px",border:`1px solid ${P.border}`,flexWrap:"wrap"}}>
        <span style={{color:P.muted,fontSize:11}}>Forecast from</span>
        <input type="date" value={baseDate} onChange={e=>setBaseDate(e.target.value)} style={{background:P.surf3,border:`1px solid ${P.border}`,borderRadius:7,color:P.text,padding:"5px 10px",fontSize:11,outline:"none",fontFamily:"inherit"}}/>
        <span style={{color:P.muted,fontSize:11}}>· 13 weeks · AR due dates + weighted pipeline</span>
        <div style={{marginLeft:"auto",color:P.muted,fontSize:11}}>Collection rate assumption: <span style={{color:P.gold,fontWeight:700}}>85%</span></div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        <KPI label="13-Wk Inflows"  value={fmtK(totalIn)}  color={P.green} accent={P.green} small sub="AR + Pipeline"/>
        <KPI label="13-Wk Outflows" value={fmtK(totalOut)} color={P.red}   accent={P.red}   small sub="AP due"/>
        <KPI label="Net Cash Pos"   value={fmtK(netPos)}   color={netPos>=0?P.green:P.red}  small/>
        <KPI label="Best Week"      value={bestWeek.label||"—"} color={P.green} small sub={fmtK(bestWeek.netFlow||0)}/>
        <KPI label="Worst Week"     value={worstWeek.label||"—"} color={P.red}  small sub={fmtK(worstWeek.netFlow||0)}/>
      </div>

      <SubTabs tabs={[{id:"forecast",label:"13-Week View"},{id:"chart",label:"Cash Bridge"},{id:"details",label:"Week Detail"}]} active={tab} onChange={setTab}/>

      {tab==="forecast"&&(
        <Card noPad title="Rolling 13-Week Cash Forecast — MYR">
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,minWidth:700}}>
              <thead><tr style={{background:P.surf2}}>
                {["Week","AR Collections","Pipeline","Total Inflows","AP Payments","Net Flow","Cumulative"].map(h=>(
                  <th key={h} style={{padding:"7px 10px",textAlign:h==="Week"?"left":"right",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{withCumulative.map((w,i)=>(
                <tr key={w.week} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}12`,opacity:w.netFlow===0&&w.arInflows===0&&w.apOutflows===0?0.4:1}}>
                  <td style={{padding:"6px 10px",color:P.gold,fontWeight:600,fontSize:11}}>{w.label}</td>
                  <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.green}}>{w.arInflows?fmtMYR(w.arInflows):"—"}</td>
                  <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.blue}}>{w.pipelineInflows?fmtMYR(w.pipelineInflows):"—"}</td>
                  <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.text,fontWeight:600}}>{fmtMYR(w.arInflows+w.pipelineInflows)}</td>
                  <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.red}}>{w.apOutflows?fmtMYR(w.apOutflows):"—"}</td>
                  <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:w.netFlow>=0?P.green:P.red,fontWeight:700}}>{w.netFlow>=0?"+":""}{fmtMYR(w.netFlow)}</td>
                  <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:w.cumulative>=0?P.gold:P.red,fontWeight:700}}>{fmtMYR(w.cumulative)}</td>
                </tr>
              ))}</tbody>
              <tfoot><tr style={{background:P.surf2,borderTop:`1px solid ${P.border}`}}>
                <td style={{padding:"7px 10px",color:P.muted,fontSize:10}}>TOTAL</td>
                <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:P.green,fontWeight:700}}>{fmtMYR(forecastData.reduce((s,w)=>s+w.arInflows,0))}</td>
                <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:P.blue,fontWeight:700}}>{fmtMYR(forecastData.reduce((s,w)=>s+w.pipelineInflows,0))}</td>
                <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:P.text,fontWeight:700}}>{fmtMYR(totalIn)}</td>
                <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:P.red,fontWeight:700}}>{fmtMYR(totalOut)}</td>
                <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:netPos>=0?P.green:P.red,fontWeight:700}}>{netPos>=0?"+":""}{fmtMYR(netPos)}</td>
                <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:P.gold,fontWeight:700}}>{fmtMYR(withCumulative[withCumulative.length-1]?.cumulative||0)}</td>
              </tr></tfoot>
            </table>
          </div>
        </Card>
      )}

      {tab==="chart"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <InsightPanel title="Weekly Cash Flow — Inflows vs Outflows">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={forecastData} margin={{top:5,right:20,left:0,bottom:20}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="label" tick={{fill:P.muted,fontSize:8}} angle={-30} textAnchor="end" interval={0}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                <ReferenceLine y={0} stroke={P.muted}/>
                <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Legend formatter={v=><span style={{color:P.muted,fontSize:11}}>{v}</span>}/>
                <Bar dataKey="arInflows"      name="AR Collections" fill={P.green}         radius={[3,3,0,0]} stackId="in"/>
                <Bar dataKey="pipelineInflows" name="Pipeline"      fill={`${P.blue}90`}   radius={[3,3,0,0]} stackId="in"/>
                <Bar dataKey="apOutflows"     name="AP Payments"    fill={P.red}            radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </InsightPanel>
          <InsightPanel title="Cumulative Cash Position — 13 Weeks">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={withCumulative} margin={{top:5,right:20,left:0,bottom:20}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="label" tick={{fill:P.muted,fontSize:8}} angle={-30} textAnchor="end" interval={0}/>
                <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                <ReferenceLine y={0} stroke={P.red} strokeDasharray="4 4" label={{value:"Zero",fill:P.red,fontSize:9}}/>
                <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Line type="monotone" dataKey="cumulative" name="Cumulative Cash" stroke={P.gold} strokeWidth={2} dot={{r:3}} fill={P.gold}/>
              </LineChart>
            </ResponsiveContainer>
          </InsightPanel>
        </div>
      )}

      {tab==="details"&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {forecastData.filter(w=>w.arInflows>0||w.pipelineInflows>0||w.apOutflows>0).map(week=>(
            <Card key={week.week} accent={week.netFlow>=0?P.green:P.red}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{color:P.gold,fontWeight:700,fontSize:13}}>{week.label}</span>
                <div style={{display:"flex",gap:12,fontSize:11}}>
                  <span style={{color:P.green}}>In: {fmtMYR(week.arInflows+week.pipelineInflows)}</span>
                  <span style={{color:P.red}}>Out: {fmtMYR(week.apOutflows)}</span>
                  <span style={{color:week.netFlow>=0?P.green:P.red,fontWeight:700}}>Net: {week.netFlow>=0?"+":""}{fmtMYR(week.netFlow)}</span>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:10,color:P.muted}}>
                <div>AR due ({week.start} → {week.end}):<br/>{ar.filter(r=>gf.entityIds.includes(r.entityId)&&r.status!=="Paid"&&r.dueDate>=week.start&&r.dueDate<=week.end).map(r=><span key={r.id} style={{color:P.sub,display:"block"}}>{r.counterparty}: {fmtAmt(r.amount,r.currency)}</span>)}</div>
                <div>AP due ({week.start} → {week.end}):<br/>{ap.filter(r=>gf.entityIds.includes(r.entityId)&&r.status!=="Paid"&&r.dueDate>=week.start&&r.dueDate<=week.end).map(r=><span key={r.id} style={{color:P.sub,display:"block"}}>{r.counterparty}: {fmtAmt(r.amount,r.currency)}</span>)}</div>
              </div>
            </Card>
          ))}
          {forecastData.filter(w=>w.arInflows>0||w.pipelineInflows>0||w.apOutflows>0).length===0&&(
            <div style={{color:P.muted,fontSize:12,textAlign:"center",padding:24,background:P.surf2,borderRadius:10}}>No AR/AP due dates found in this 13-week window. Add due dates to AR/AP records.</div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MODULE 3: MONTH-END CLOSE TRACKER
// ══════════════════════════════════════════════════════════════════
function CloseTrackerModule({gf}){
  const {store,setStore}=useStore();
  const {closeTasks=[],entities,fxRates}=store;
  const periods=fxRates.map(r=>r.period);
  const [fPeriod,setFPeriod]=useState(periods[periods.length-1]||"");
  const [tab,setTab]=useState("board");
  const [form,setForm]=useState({entityId:gf.entityIds[0]||"",category:CLOSE_CATEGORIES[0],task:"",responsible:"Finance",dueDay:5});

  const activeE=entities.filter(e=>e.active&&gf.entityIds.includes(e.id));
  const filtTasks=closeTasks.filter(t=>t.period===fPeriod&&gf.entityIds.includes(t.entityId));

  function toggleDone(id){const ns={...store,closeTasks:closeTasks.map(t=>t.id===id?{...t,done:!t.done}:t)};setStore(ns);persist(ns);}
  function addTask(){
    if(!form.task.trim())return;
    const t={id:"CT"+Math.random().toString(36).slice(2,8).toUpperCase(),...form,period:fPeriod,done:false};
    const ns={...store,closeTasks:[...closeTasks,t]};setStore(ns);persist(ns);setForm(f=>({...f,task:""}));
  }
  function deleteTask(id){const ns={...store,closeTasks:closeTasks.filter(t=>t.id!==id)};setStore(ns);persist(ns);}

  // Stats per entity
  const entityStats=activeE.map(e=>{
    const tasks=filtTasks.filter(t=>t.entityId===e.id);
    const done=tasks.filter(t=>t.done).length;
    const pct=tasks.length?Math.round(done/tasks.length*100):0;
    return{...e,tasks,done,total:tasks.length,pct};
  });

  // Overall
  const totalDone=filtTasks.filter(t=>t.done).length;
  const totalTasks=filtTasks.length;
  const overallPct=totalTasks?Math.round(totalDone/totalTasks*100):0;

  // By category
  const catStats=CLOSE_CATEGORIES.map(cat=>{
    const tasks=filtTasks.filter(t=>t.category===cat);
    const done=tasks.filter(t=>t.done).length;
    return{cat,done,total:tasks.length,pct:tasks.length?Math.round(done/tasks.length*100):0};
  }).filter(c=>c.total>0);

  const overallColor=overallPct===100?P.green:overallPct>60?P.gold:P.red;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Period selector */}
      <div style={{display:"flex",gap:10,alignItems:"center",background:P.surf2,borderRadius:10,padding:"10px 14px",border:`1px solid ${P.border}`,flexWrap:"wrap"}}>
        <span style={{color:P.muted,fontSize:11}}>Close Period</span>
        <Sel value={fPeriod} onChange={setFPeriod} style={{width:140}}>{periods.map(p=><option key={p}>{p}</option>)}</Sel>
        <div style={{marginLeft:"auto",display:"flex",gap:16,fontSize:11}}>
          <span style={{color:overallColor,fontWeight:700}}>{overallPct}% complete</span>
          <span style={{color:P.green}}>{totalDone} done</span>
          <span style={{color:P.red}}>{totalTasks-totalDone} pending</span>
        </div>
      </div>

      {/* Overall progress bar */}
      <div style={{background:P.surf2,borderRadius:10,padding:"12px 16px",border:`1px solid ${P.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{color:P.text,fontWeight:700,fontSize:13}}>Overall Close Progress — {fPeriod}</span>
          <span style={{color:overallColor,fontFamily:"monospace",fontSize:16,fontWeight:800}}>{overallPct}%</span>
        </div>
        <div style={{height:10,background:P.border,borderRadius:5,overflow:"hidden"}}>
          <div style={{height:"100%",width:overallPct+"%",background:`linear-gradient(90deg,${P.mag},${P.gold})`,borderRadius:5,transition:"width 0.4s ease"}}/>
        </div>
      </div>

      <SubTabs tabs={[{id:"board",label:"Task Board"},{id:"entity",label:"By Entity"},{id:"category",label:"By Category"},{id:"add",label:"+ Add Tasks"}]} active={tab} onChange={setTab}/>

      {tab==="board"&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {CLOSE_CATEGORIES.map(cat=>{
            const tasks=filtTasks.filter(t=>t.category===cat);
            if(!tasks.length)return null;
            const catClr=CLOSE_CAT_CLR[cat]||P.gold;
            const catDone=tasks.filter(t=>t.done).length;
            return(
              <div key={cat}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:catClr}}/>
                  <span style={{color:catClr,fontWeight:700,fontSize:11,letterSpacing:1}}>{cat.toUpperCase()}</span>
                  <span style={{color:P.muted,fontSize:10}}>{catDone}/{tasks.length}</span>
                  <div style={{flex:1,height:2,background:P.border,borderRadius:1,overflow:"hidden"}}>
                    <div style={{height:"100%",width:(catDone/tasks.length*100)+"%",background:catClr,transition:"width 0.3s"}}/>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  {tasks.sort((a,b)=>a.dueDay-b.dueDay).map(t=>{
                    const e=entities.find(x=>x.id===t.entityId);
                    return(
                      <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,background:t.done?`${P.green}08`:P.surf2,border:`1px solid ${t.done?P.green+"30":P.border}`,borderRadius:8,padding:"8px 12px",transition:"all 0.15s"}}>
                        <button onClick={()=>toggleDone(t.id)} style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${t.done?P.green:P.border}`,background:t.done?P.green:"transparent",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#07090F"}}>
                          {t.done?"✓":""}
                        </button>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{color:t.done?P.muted:P.text,fontSize:12,textDecoration:t.done?"line-through":"none",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.task}</div>
                          <div style={{display:"flex",gap:8,marginTop:2}}>
                            <span style={{color:P.muted,fontSize:9}}>Day {t.dueDay}</span>
                            <span style={{color:P.muted,fontSize:9}}>·</span>
                            <span style={{color:P.muted,fontSize:9}}>{t.responsible}</span>
                            {e&&<><span style={{color:P.muted,fontSize:9}}>·</span><span style={{color:e.color,fontSize:9}}>{e.name}</span></>}
                          </div>
                        </div>
                        <Btn onClick={()=>deleteTask(t.id)} small outline danger>✕</Btn>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {filtTasks.length===0&&<div style={{color:P.muted,fontSize:12,textAlign:"center",padding:24,background:P.surf2,borderRadius:10}}>No close tasks for {fPeriod}. Add tasks using the + Add Tasks tab.</div>}
        </div>
      )}

      {tab==="entity"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
          {entityStats.map(e=>(
            <Card key={e.id} accent={e.color}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><EntityDot entity={e} size={8}/><span style={{color:e.color,fontWeight:700,fontSize:13}}>{e.name}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{color:P.muted,fontSize:11}}>{e.done}/{e.total} tasks</span>
                <span style={{color:e.pct===100?P.green:e.pct>60?P.gold:P.red,fontFamily:"monospace",fontSize:16,fontWeight:800}}>{e.pct}%</span>
              </div>
              <div style={{height:6,background:P.border,borderRadius:3,overflow:"hidden",marginBottom:10}}>
                <div style={{height:"100%",width:e.pct+"%",background:e.color,borderRadius:3}}/>
              </div>
              {e.tasks.filter(t=>!t.done).slice(0,4).map(t=>(
                <div key={t.id} style={{display:"flex",gap:6,alignItems:"center",padding:"4px 0",borderBottom:`1px solid ${P.border}20`}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:CLOSE_CAT_CLR[t.category]||P.muted,flexShrink:0}}/>
                  <span style={{color:P.sub,fontSize:10,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.task}</span>
                  <span style={{color:P.muted,fontSize:9}}>d{t.dueDay}</span>
                </div>
              ))}
            </Card>
          ))}
        </div>
      )}

      {tab==="category"&&(
        <Card noPad title="Close Progress by Category">
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead><tr style={{background:P.surf2}}>{["Category","Done","Total","Progress","Status"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1}}>{h}</th>)}</tr></thead>
            <tbody>{catStats.map((c,i)=>(
              <tr key={c.cat} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}12`}}>
                <td style={{padding:"8px 10px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:CLOSE_CAT_CLR[c.cat]||P.gold}}/>
                    <span style={{color:P.text,fontWeight:600}}>{c.cat}</span>
                  </div>
                </td>
                <td style={{padding:"8px 10px",color:P.green,fontFamily:"monospace"}}>{c.done}</td>
                <td style={{padding:"8px 10px",color:P.sub,fontFamily:"monospace"}}>{c.total}</td>
                <td style={{padding:"8px 10px",minWidth:140}}>
                  <div style={{height:6,background:P.border,borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:c.pct+"%",background:CLOSE_CAT_CLR[c.cat]||P.gold,borderRadius:3}}/>
                  </div>
                </td>
                <td style={{padding:"8px 10px"}}><Badge label={c.pct===100?"Complete":c.pct>0?"In Progress":"Not Started"} color={c.pct===100?P.green:c.pct>0?P.gold:P.red}/></td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}

      {tab==="add"&&(
        <Card title="Add Close Task" accent={P.green}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>ENTITY</div><Sel value={form.entityId} onChange={v=>setForm(f=>({...f,entityId:v}))} style={{width:"100%"}}>{activeE.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>CATEGORY</div><Sel value={form.category} onChange={v=>setForm(f=>({...f,category:v}))} style={{width:"100%"}}>{CLOSE_CATEGORIES.map(c=><option key={c}>{c}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>DUE (WORKING DAY)</div><input type="number" min={1} max={20} value={form.dueDay} onChange={e=>setForm(f=>({...f,dueDay:parseInt(e.target.value)||1}))} style={{width:"100%",background:P.surf2,border:`1px solid ${P.border}`,borderRadius:7,color:P.text,padding:"7px 11px",fontSize:12,outline:"none",fontFamily:"inherit"}}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 200px auto",gap:10,alignItems:"end"}}>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>TASK *</div><Input value={form.task} onChange={v=>setForm(f=>({...f,task:v}))} placeholder="e.g. Reconcile bank accounts"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>RESPONSIBLE</div><Input value={form.responsible} onChange={v=>setForm(f=>({...f,responsible:v}))} placeholder="Finance"/></div>
            <div style={{paddingTop:16}}><Btn onClick={addTask} color={P.green}>+ Add</Btn></div>
          </div>
          <div style={{marginTop:10,fontSize:10,color:P.muted}}>Tip: Tasks are linked to the selected period. Create a template for each entity then reuse by changing the period.</div>
        </Card>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MODULE 4: STATUTORY REPORT PACK
// ══════════════════════════════════════════════════════════════════
function ReportPackModule({gf}){
  const {store}=useStore();
  const {gl,coa,entities,fxRates,ar,ap,sales=[],budget}=store;
  const periods=fxRates.map(r=>r.period);
  const lastTwo=periods.slice(-2);
  const [rPeriod,setRPeriod]=useState(periods[periods.length-1]||"");
  const [rPrior, setRPrior] =useState(periods[periods.length-2]||"");
  const [tab,setTab]=useState("preview");

  const activeE=entities.filter(e=>e.active&&gf.entityIds.includes(e.id));
  const spotRow=fxRates[fxRates.length-1]||{};

  function toRM(amt,ccy){if(!amt)return 0;if(ccy===BASE)return amt;if(ccy==="USD")return amt*(spotRow.MYR||4.5);const r=spotRow[ccy],m=spotRow.MYR;return(r&&m)?amt*(m/r):amt;}

  // Simple P&L computation for report pack
  function simplePL(pds,eids){
    let rev=0,exp=0;
    const byAcct={};
    eids.forEach(eid=>{
      const e=entities.find(x=>x.id===eid);const ccy=e?.currency||BASE;
      const rates=pds.map(p=>getFxRate(fxRates,p,ccy));
      const avgR=rates.reduce((a,b)=>a+b,0)/(rates.length||1);
      gl.filter(j=>j.entityId===eid&&pds.includes(j.period)).forEach(j=>{
        const acr=coa.find(a=>a.code===j.crAccount);
        const adr=coa.find(a=>a.code===j.drAccount);
        if(acr?.class==="R"){rev+=j.amount*avgR;byAcct[j.crAccount]=(byAcct[j.crAccount]||0)+j.amount*avgR;}
        if(adr?.class==="X"){exp+=j.amount*avgR;byAcct[j.drAccount]=(byAcct[j.drAccount]||0)+j.amount*avgR;}
      });
    });
    return{rev,exp,profit:rev-exp,byAcct};
  }

  const pl2=simplePL([rPeriod],activeE.map(e=>e.id));
  const pl1=simplePL([rPrior], activeE.map(e=>e.id));
  const arOut=ar.filter(r=>gf.entityIds.includes(r.entityId)&&r.status!=="Paid").reduce((s,r)=>s+toRM(r.amount,r.currency),0);
  const apOut=ap.filter(r=>gf.entityIds.includes(r.entityId)&&r.status!=="Paid").reduce((s,r)=>s+toRM(r.amount,r.currency),0);
  const wonSales=sales.filter(d=>gf.entityIds.includes(d.entityId)&&d.stage==="Won").reduce((s,d)=>s+toRM(d.value,d.currency),0);
  const pipeline=sales.filter(d=>gf.entityIds.includes(d.entityId)&&!["Won","Lost"].includes(d.stage)).reduce((s,d)=>s+toRM(d.value,d.currency),0);

  const gpMargin=pl2.rev>0?((pl2.rev-0)/pl2.rev*100):0;
  const npMargin=pl2.rev>0?(pl2.profit/pl2.rev*100):0;
  const revGrowth=pl1.rev>0?((pl2.rev-pl1.rev)/pl1.rev*100):0;

  // Build HTML report for download
  function buildReport(){
    const now=new Date().toLocaleDateString("en-MY",{day:"2-digit",month:"long",year:"numeric"});
    const rows=(obj)=>Object.entries(obj).map(([k,v])=>`<tr><td style="padding:6px 12px;color:#9DAEC4;font-size:12px;">${coa.find(a=>a.code===k)?.name||k}</td><td style="padding:6px 12px;text-align:right;font-family:monospace;font-size:12px;color:#E8EDF5;">${fmtMYR(Math.abs(v))}</td></tr>`).join("");
    const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Management Accounts — ${rPeriod}</title>
<style>*{box-sizing:border-box;margin:0;padding:0;}body{background:#07090F;color:#E8EDF5;font-family:'DM Sans',sans-serif;padding:48px;}
h1{font-size:28px;font-weight:800;color:#FAA819;margin-bottom:4px;}h2{font-size:16px;font-weight:700;color:#E8EDF5;margin:28px 0 12px;border-bottom:1px solid #1E2A3A;padding-bottom:6px;}
.sub{color:#5A6A82;font-size:12px;margin-bottom:32px;}
table{width:100%;border-collapse:collapse;margin-bottom:20px;}
th{background:#0D1420;padding:8px 12px;text-align:left;color:#FAA819;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;}
th:last-child{text-align:right;}
td{border-bottom:1px solid rgba(255,255,255,0.04);}
.total td{background:#121C2C;font-weight:700;border-top:2px solid #FAA819;}
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:32px;}
.kpi{background:#0D1420;border:1px solid #1E2A3A;border-radius:10px;padding:16px;}
.kpi-val{font-size:22px;font-weight:800;font-family:monospace;margin-bottom:4px;}
.kpi-lbl{font-size:10px;color:#5A6A82;letter-spacing:1.5px;text-transform:uppercase;}
.footer{margin-top:48px;padding-top:20px;border-top:1px solid #1E2A3A;color:#5A6A82;font-size:11px;display:flex;justify-content:space-between;}
@media print{body{background:#07090F;}@page{size:A4;margin:20mm;}}
</style></head><body>
<h1>Management Accounts</h1>
<div class="sub">${rPeriod} vs ${rPrior} · ${activeE.map(e=>e.name).join(", ")} · Prepared ${now}</div>
<div class="kpi-grid">
  <div class="kpi"><div class="kpi-val" style="color:#22D3A0">${fmtK(pl2.rev)}</div><div class="kpi-lbl">Revenue</div></div>
  <div class="kpi"><div class="kpi-val" style="color:${pl2.profit>=0?"#22D3A0":"#F43F5E"}">${fmtK(pl2.profit)}</div><div class="kpi-lbl">Net Profit</div></div>
  <div class="kpi"><div class="kpi-val" style="color:#38BDF8">${npMargin.toFixed(1)}%</div><div class="kpi-lbl">NP Margin</div></div>
  <div class="kpi"><div class="kpi-val" style="color:${revGrowth>=0?"#22D3A0":"#F43F5E"}">${revGrowth>=0?"+":""}${revGrowth.toFixed(1)}%</div><div class="kpi-lbl">Revenue Growth</div></div>
</div>
<h2>Profit & Loss Statement</h2>
<table><thead><tr><th>Account</th><th>${rPeriod}</th><th>${rPrior}</th><th>Change</th></tr></thead><tbody>
<tr><td colspan="4" style="padding:8px 12px;background:#0D1420;color:#22D3A0;font-size:11px;font-weight:700;letter-spacing:1px;">REVENUE</td></tr>
${Object.entries(pl2.byAcct).filter(([k])=>coa.find(a=>a.code===k)?.class==="R").map(([k,v])=>{const p=pl1.byAcct[k]||0;return`<tr><td style="padding:6px 12px;color:#9DAEC4;font-size:12px;">${coa.find(a=>a.code===k)?.name||k}</td><td style="padding:6px 12px;text-align:right;font-family:monospace;font-size:12px;color:#E8EDF5;">${fmtMYR(v)}</td><td style="padding:6px 12px;text-align:right;font-family:monospace;font-size:12px;color:#5A6A82;">${fmtMYR(p)}</td><td style="padding:6px 12px;text-align:right;font-family:monospace;font-size:12px;color:${v>=p?"#22D3A0":"#F43F5E"};">${p>0?((v-p)/p*100).toFixed(1)+"%":"—"}</td></tr>`}).join("")}
<tr class="total"><td style="padding:7px 12px;font-size:12px;">Total Revenue</td><td style="padding:7px 12px;text-align:right;font-family:monospace;color:#22D3A0;">${fmtMYR(pl2.rev)}</td><td style="padding:7px 12px;text-align:right;font-family:monospace;color:#5A6A82;">${fmtMYR(pl1.rev)}</td><td style="padding:7px 12px;text-align:right;font-family:monospace;color:${pl2.rev>=pl1.rev?"#22D3A0":"#F43F5E"};">${pl1.rev>0?((pl2.rev-pl1.rev)/pl1.rev*100).toFixed(1)+"%":"—"}</td></tr>
<tr><td colspan="4" style="padding:8px 12px;background:#0D1420;color:#F43F5E;font-size:11px;font-weight:700;letter-spacing:1px;">OPERATING EXPENSES</td></tr>
${Object.entries(pl2.byAcct).filter(([k])=>coa.find(a=>a.code===k)?.class==="X").map(([k,v])=>{const p=pl1.byAcct[k]||0;return`<tr><td style="padding:6px 12px;color:#9DAEC4;font-size:12px;">${coa.find(a=>a.code===k)?.name||k}</td><td style="padding:6px 12px;text-align:right;font-family:monospace;font-size:12px;color:#E8EDF5;">${fmtMYR(v)}</td><td style="padding:6px 12px;text-align:right;font-family:monospace;font-size:12px;color:#5A6A82;">${fmtMYR(p)}</td><td style="padding:6px 12px;text-align:right;font-family:monospace;font-size:12px;color:${v<=p?"#22D3A0":"#F43F5E"};">${p>0?((v-p)/p*100).toFixed(1)+"%":"—"}</td></tr>`}).join("")}
<tr class="total"><td style="padding:7px 12px;font-size:12px;">Total Expenses</td><td style="padding:7px 12px;text-align:right;font-family:monospace;color:#FB923C;">${fmtMYR(pl2.exp)}</td><td style="padding:7px 12px;text-align:right;font-family:monospace;color:#5A6A82;">${fmtMYR(pl1.exp)}</td><td style="padding:7px 12px;text-align:right;font-family:monospace;color:${pl2.exp<=pl1.exp?"#22D3A0":"#F43F5E"};">${pl1.exp>0?((pl2.exp-pl1.exp)/pl1.exp*100).toFixed(1)+"%":"—"}</td></tr>
<tr class="total" style="border-top:3px solid #FAA819;"><td style="padding:10px 12px;font-size:14px;color:#FAA819;">NET PROFIT / (LOSS)</td><td style="padding:10px 12px;text-align:right;font-family:monospace;font-size:15px;color:${pl2.profit>=0?"#22D3A0":"#F43F5E"};">${fmtMYR(pl2.profit)}</td><td style="padding:10px 12px;text-align:right;font-family:monospace;font-size:13px;color:#5A6A82;">${fmtMYR(pl1.profit)}</td><td style="padding:10px 12px;text-align:right;font-family:monospace;color:${pl2.profit>=pl1.profit?"#22D3A0":"#F43F5E"};">${pl1.profit!==0?((pl2.profit-pl1.profit)/Math.abs(pl1.profit)*100).toFixed(1)+"%":"—"}</td></tr>
</tbody></table>
<h2>Key Performance Indicators</h2>
<table><thead><tr><th>Metric</th><th>${rPeriod}</th><th>${rPrior}</th></tr></thead><tbody>
${[["NP Margin",npMargin.toFixed(1)+"%",(pl1.rev>0?(pl1.profit/pl1.rev*100):0).toFixed(1)+"%"],["Revenue Growth",revGrowth.toFixed(1)+"%","—"],["AR Outstanding",fmtMYR(arOut),"—"],["AP Outstanding",fmtMYR(apOut),"—"],["Won Revenue (Sales)",fmtMYR(wonSales),"—"],["Pipeline Value",fmtMYR(pipeline),"—"]].map(([l,v,p])=>`<tr><td style="padding:6px 12px;color:#9DAEC4;font-size:12px;">${l}</td><td style="padding:6px 12px;text-align:right;font-family:monospace;font-size:12px;color:#E8EDF5;">${v}</td><td style="padding:6px 12px;text-align:right;font-family:monospace;font-size:12px;color:#5A6A82;">${p}</td></tr>`).join("")}
</tbody></table>
<div class="footer"><div>FinFlow — Management Accounts Pack · ${rPeriod}<br>Prepared by SynerGrowth Consulting · www.synergrowth.com.sg</div><div style="text-align:right;">Generated ${now}<br>Confidential</div></div>
</body></html>`;
    return html;
  }

  function downloadReport(){
    const html=buildReport();
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([html],{type:"text/html"}));
    a.download="Management_Accounts_"+rPeriod.replace(" ","_")+".html";
    a.click();
  }

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Controls */}
      <div style={{display:"flex",gap:10,alignItems:"center",background:P.surf2,borderRadius:10,padding:"10px 14px",border:`1px solid ${P.border}`,flexWrap:"wrap"}}>
        <span style={{color:P.muted,fontSize:11}}>Current Period</span>
        <Sel value={rPeriod} onChange={setRPeriod} style={{width:130}}>{periods.map(p=><option key={p}>{p}</option>)}</Sel>
        <span style={{color:P.muted,fontSize:11}}>vs Prior</span>
        <Sel value={rPrior}  onChange={setRPrior}  style={{width:130}}>{periods.map(p=><option key={p}>{p}</option>)}</Sel>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <Btn onClick={downloadReport} color={P.gold}>↓ Download Pack</Btn>
        </div>
      </div>
      <div style={{background:`${P.blue}10`,border:`1px solid ${P.blue}30`,borderRadius:9,padding:"9px 14px",fontSize:11,color:P.blue}}>
        Download the report as an HTML file → open in browser → Print → Save as PDF for a polished, print-ready management accounts pack.
      </div>

      <SubTabs tabs={[{id:"preview",label:"Preview"},{id:"kpis",label:"KPIs"}]} active={tab} onChange={setTab}/>

      {tab==="preview"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
            <KPI label="Revenue"      value={fmtK(pl2.rev)}    color={P.green}  accent={P.green}  small sub={<Delta current={pl2.rev} previous={pl1.rev}/>}/>
            <KPI label="Net Profit"   value={fmtK(pl2.profit)}  color={pl2.profit>=0?P.green:P.red} small sub={npMargin.toFixed(1)+"%"}/>
            <KPI label="Rev Growth"   value={(revGrowth>=0?"+":"")+revGrowth.toFixed(1)+"%"} color={revGrowth>=0?P.green:P.red} small/>
            <KPI label="AR O/S"       value={fmtK(arOut)}        color={P.gold}   small/>
            <KPI label="AP O/S"       value={fmtK(apOut)}        color={P.mag}    small/>
            <KPI label="Pipeline"     value={fmtK(pipeline)}     color={P.blue}   small/>
          </div>

          <Card noPad title={"P&L Preview — "+rPeriod+" vs "+rPrior}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:P.surf2}}>{["Account","Class",rPeriod,rPrior,"Change"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:["Class"].includes(h)?"center":["Account"].includes(h)?"left":"right",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1}}>{h}</th>)}</tr></thead>
              <tbody>
                {["R","X"].map(cls=>{
                  const cl=cls==="R"?"REVENUE":"EXPENSES";
                  const clr=cls==="R"?P.green:P.red;
                  const rows2=Object.entries(pl2.byAcct).filter(([k])=>coa.find(a=>a.code===k)?.class===cls);
                  const sub2=rows2.reduce((s,[,v])=>s+v,0);
                  const sub1=Object.entries(pl1.byAcct).filter(([k])=>coa.find(a=>a.code===k)?.class===cls).reduce((s,[,v])=>s+v,0);
                  return[
                    <tr key={"h"+cls}><td colSpan={5} style={{padding:"8px 10px",background:P.surf2,color:clr,fontSize:10,fontWeight:700,letterSpacing:1}}>{cl}</td></tr>,
                    ...rows2.map(([k,v],i)=>{const p=pl1.byAcct[k]||0;const chg=p>0?((v-p)/p*100):null;return(
                      <tr key={k} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}10`}}>
                        <td style={{padding:"6px 10px",color:P.sub,paddingLeft:20}}>{coa.find(a=>a.code===k)?.name||k}</td>
                        <td style={{padding:"6px 10px",textAlign:"center"}}><Badge label={k} color={clr}/></td>
                        <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.text}}>{fmtMYR(v)}</td>
                        <td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.muted}}>{fmtMYR(p)}</td>
                        <td style={{padding:"6px 10px",textAlign:"right",fontSize:10,color:chg===null?P.muted:cls==="R"?chg>=0?P.green:P.red:chg<=0?P.green:P.red}}>{chg!==null?(chg>=0?"▲":"▼")+Math.abs(chg).toFixed(1)+"%":"—"}</td>
                      </tr>
                    );}),
                    <tr key={"s"+cls} style={{background:P.surf2}}><td colSpan={2} style={{padding:"6px 10px",color:clr,fontSize:10,fontWeight:700}}>Total {cls==="R"?"Revenue":"Expenses"}</td><td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:clr,fontWeight:700}}>{fmtMYR(sub2)}</td><td style={{padding:"6px 10px",fontFamily:"monospace",textAlign:"right",color:P.muted,fontWeight:700}}>{fmtMYR(sub1)}</td><td/></tr>,
                  ];
                })}
                <tr style={{borderTop:`2px solid ${P.gold}`,background:P.surf3}}>
                  <td colSpan={2} style={{padding:"10px",color:P.gold,fontWeight:700,fontSize:12}}>NET PROFIT / (LOSS)</td>
                  <td style={{padding:"10px",fontFamily:"monospace",textAlign:"right",color:pl2.profit>=0?P.green:P.red,fontWeight:700,fontSize:13}}>{fmtMYR(pl2.profit)}</td>
                  <td style={{padding:"10px",fontFamily:"monospace",textAlign:"right",color:P.muted,fontSize:12}}>{fmtMYR(pl1.profit)}</td>
                  <td/>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {tab==="kpis"&&(
        <Card title="KPI Summary for Board Pack">
          {[
            {label:"Revenue",cur:fmtK(pl2.rev),prev:fmtK(pl1.rev),note:"Total group revenue (MYR equivalent)"},
            {label:"Net Profit",cur:fmtK(pl2.profit),prev:fmtK(pl1.profit),note:"After all operating expenses"},
            {label:"NP Margin",cur:npMargin.toFixed(1)+"%",prev:pl1.rev>0?(pl1.profit/pl1.rev*100).toFixed(1)+"%":"—",note:"Net profit as % of revenue"},
            {label:"Revenue Growth",cur:(revGrowth>=0?"+":"")+revGrowth.toFixed(1)+"%",prev:"—",note:"Period on period"},
            {label:"AR Outstanding",cur:fmtK(arOut),prev:"—",note:"Receivables not yet collected"},
            {label:"AP Outstanding",cur:fmtK(apOut),prev:"—",note:"Payables not yet settled"},
            {label:"Sales Pipeline",cur:fmtK(pipeline),prev:"—",note:"Active deals in pipeline"},
            {label:"Won Revenue (Cumulative)",cur:fmtK(wonSales),prev:"—",note:"Total won deals"},
          ].map((row,i)=>(
            <div key={row.label} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<7?`1px solid ${P.border}20`:"none"}}>
              <div style={{width:180,color:P.sub,fontSize:12,fontWeight:600}}>{row.label}</div>
              <div style={{width:110,fontFamily:"monospace",color:P.gold,fontSize:13,fontWeight:700}}>{row.cur}</div>
              <div style={{width:100,fontFamily:"monospace",color:P.muted,fontSize:11}}>{row.prev}</div>
              <div style={{color:P.muted,fontSize:10,flex:1}}>{row.note}</div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MODULE 5: FIXED ASSET REGISTER
// ══════════════════════════════════════════════════════════════════
function FixedAssetModule({gf}){
  const {store,setStore}=useStore();
  const {assets=[],entities,fxRates}=store;
  const [tab,setTab]=useState("register");
  const spotRow=fxRates[fxRates.length-1]||{};
  const periods=fxRates.map(r=>r.period);
  const [asOf,setAsOf]=useState(periods[periods.length-1]||"Dec 2024");

  function toRM(amt,ccy){if(!amt)return 0;if(ccy===BASE)return amt;if(ccy==="USD")return amt*(spotRow.MYR||4.5);const r=spotRow[ccy],m=spotRow.MYR;return(r&&m)?amt*(m/r):amt;}

  const activeE=entities.filter(e=>e.active&&gf.entityIds.includes(e.id));
  const filtAssets=assets.filter(a=>gf.entityIds.includes(a.entityId)&&a.active);

  // Straight-line depreciation
  function calcDepreciation(asset,upToDate){
    const start=new Date(asset.purchaseDate);
    const upto=upToDate?new Date(upToDate):new Date();
    const monthsElapsed=Math.max(0,(upto.getFullYear()-start.getFullYear())*12+(upto.getMonth()-start.getMonth()));
    const totalMonths=asset.usefulLife*12;
    const depreciableAmount=toRM(asset.cost,asset.currency)-toRM(asset.residual||0,asset.currency);
    const monthlyDeprn=depreciableAmount/totalMonths;
    const accumulated=Math.min(depreciableAmount,monthlyDeprn*monthsElapsed);
    const nbv=toRM(asset.cost,asset.currency)-accumulated;
    const annualDeprn=monthlyDeprn*12;
    const remaining=Math.max(0,totalMonths-monthsElapsed);
    return{accumulated,nbv,annualDeprn,monthlyDeprn,remaining:Math.ceil(remaining/12)};
  }

  function getAsOfDate(period){
    const months={Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12"};
    const [mon,yr]=period.split(" ");
    return yr+"-"+(months[mon]||"01")+"-28";
  }

  const asOfDate=getAsOfDate(asOf);
  const enriched=filtAssets.map(a=>{
    const d=calcDepreciation(a,asOfDate);
    return{...a,...d,costMYR:toRM(a.cost,a.currency),entity:entities.find(e=>e.id===a.entityId)};
  });

  const totalCost=enriched.reduce((s,a)=>s+a.costMYR,0);
  const totalAcc=enriched.reduce((s,a)=>s+a.accumulated,0);
  const totalNBV=enriched.reduce((s,a)=>s+a.nbv,0);
  const totalAnnualDeprn=enriched.reduce((s,a)=>s+a.annualDeprn,0);

  // Category breakdown
  const catMap={};
  enriched.forEach(a=>{
    if(!catMap[a.category])catMap[a.category]={cost:0,acc:0,nbv:0};
    catMap[a.category].cost+=a.costMYR;catMap[a.category].acc+=a.accumulated;catMap[a.category].nbv+=a.nbv;
  });

  const BLANK={entityId:activeE[0]?.id||"",name:"",category:ASSET_CATEGORIES[0],cost:"",currency:"MYR",purchaseDate:"",usefulLife:5,residual:0,active:true,notes:""};
  const [form,setForm]=useState({...BLANK});
  const [editing,setEditing]=useState(null);

  function save(){
    if(!form.name||!form.cost||!form.purchaseDate)return;
    const a={...form,id:form.id||"FA"+Math.random().toString(36).slice(2,7).toUpperCase(),cost:parseFloat(form.cost),residual:parseFloat(form.residual)||0,usefulLife:parseInt(form.usefulLife)||5};
    const updated=editing?assets.map(x=>x.id===editing?a:x):[...assets,a];
    const ns={...store,assets:updated};setStore(ns);persist(ns);setForm({...BLANK});setEditing(null);
  }
  function retire(id){const ns={...store,assets:assets.map(a=>a.id===id?{...a,active:false}:a)};setStore(ns);persist(ns);}

  const catColors=[P.blue,P.gold,P.green,P.purple,P.orange,P.red,P.mag];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",gap:10,alignItems:"center",background:P.surf2,borderRadius:10,padding:"10px 14px",border:`1px solid ${P.border}`,flexWrap:"wrap"}}>
        <span style={{color:P.muted,fontSize:11}}>Depreciation as at</span>
        <Sel value={asOf} onChange={setAsOf} style={{width:140}}>{periods.map(p=><option key={p}>{p}</option>)}</Sel>
        <span style={{color:P.muted,fontSize:11}}>Method: <span style={{color:P.gold}}>Straight-line</span></span>
        <div style={{marginLeft:"auto",fontSize:11,color:P.muted}}>{enriched.length} active assets</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        <KPI label="Total Cost"    value={fmtK(totalCost)}       color={P.blue}   accent={P.blue}   small/>
        <KPI label="Accumulated"   value={fmtK(totalAcc)}        color={P.orange} accent={P.orange} small sub={(totalCost>0?(totalAcc/totalCost*100):0).toFixed(0)+"%"}/>
        <KPI label="Net Book Value" value={fmtK(totalNBV)}       color={P.green}  accent={P.green}  small/>
        <KPI label="Annual Deprn"  value={fmtK(totalAnnualDeprn)} color={P.red}  small sub="per year"/>
        <KPI label="Monthly Deprn" value={fmtK(totalAnnualDeprn/12)} color={P.purple} small/>
      </div>

      <SubTabs tabs={[{id:"register",label:"Asset Register"},{id:"schedule",label:"Depreciation Schedule"},{id:"category",label:"By Category"},{id:"add",label:"+ Add Asset"}]} active={tab} onChange={setTab}/>

      {tab==="register"&&(
        <Card noPad>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:P.surf2}}>{["Asset","Entity","Category","Cost (MYR)","Acc. Deprn","Net Book Value","Annual Deprn","Remaining",""].map(h=><th key={h} style={{padding:"7px 10px",textAlign:["Cost (MYR)","Acc. Deprn","Net Book Value","Annual Deprn"].includes(h)?"right":"left",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
              <tbody>{enriched.map((a,i)=>(
                <tr key={a.id} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}12`}}>
                  <td style={{padding:"7px 10px"}}><div style={{color:P.text,fontWeight:600,fontSize:12}}>{a.name}</div><div style={{color:P.muted,fontSize:9}}>{a.purchaseDate} · {a.usefulLife}yr life</div></td>
                  <td style={{padding:"7px 10px"}}>{a.entity&&<div style={{display:"flex",alignItems:"center",gap:5}}><EntityDot entity={a.entity} size={6}/><span style={{color:a.entity.color,fontSize:10}}>{a.entity.name}</span></div>}</td>
                  <td style={{padding:"7px 10px"}}><Badge label={a.category} color={P.blue}/></td>
                  <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:P.text}}>{fmtMYR(a.costMYR)}</td>
                  <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:P.orange}}>{fmtMYR(a.accumulated)}</td>
                  <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:P.green,fontWeight:700}}>{fmtMYR(a.nbv)}</td>
                  <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:P.red}}>{fmtMYR(a.annualDeprn)}</td>
                  <td style={{padding:"7px 10px",color:a.remaining<=1?P.red:P.sub,fontSize:10,fontWeight:a.remaining<=1?700:400}}>{a.remaining}yr</td>
                  <td style={{padding:"7px 10px"}}><Btn onClick={()=>retire(a.id)} small outline color={P.muted}>Retire</Btn></td>
                </tr>
              ))}</tbody>
              <tfoot><tr style={{background:P.surf2,borderTop:`1px solid ${P.border}`}}>
                <td colSpan={3} style={{padding:"7px 10px",color:P.muted,fontSize:10}}>TOTAL</td>
                <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:P.blue,fontWeight:700}}>{fmtMYR(totalCost)}</td>
                <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:P.orange,fontWeight:700}}>{fmtMYR(totalAcc)}</td>
                <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:P.green,fontWeight:700}}>{fmtMYR(totalNBV)}</td>
                <td style={{padding:"7px 10px",fontFamily:"monospace",textAlign:"right",color:P.red,fontWeight:700}}>{fmtMYR(totalAnnualDeprn)}</td>
                <td colSpan={2}/>
              </tr></tfoot>
            </table>
          </div>
        </Card>
      )}

      {tab==="schedule"&&(
        <InsightPanel title="Cost, Accumulated Depreciation & NBV by Asset">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={enriched.map(a=>({name:a.name.length>18?a.name.slice(0,16)+"…":a.name,Cost:a.costMYR,Accumulated:a.accumulated,NBV:a.nbv}))} margin={{top:5,right:20,left:0,bottom:40}}>
              <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
              <XAxis dataKey="name" tick={{fill:P.muted,fontSize:9}} angle={-20} textAnchor="end" interval={0}/>
              <YAxis tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
              <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
              <Legend formatter={v=><span style={{color:P.muted,fontSize:11}}>{v}</span>}/>
              <Bar dataKey="Cost"        fill={`${P.blue}50`}  radius={[3,3,0,0]}/>
              <Bar dataKey="Accumulated" fill={P.orange}        radius={[3,3,0,0]}/>
              <Bar dataKey="NBV"         fill={P.green}         radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </InsightPanel>
      )}

      {tab==="category"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
          {Object.entries(catMap).map(([cat,d],i)=>(
            <Card key={cat} accent={catColors[i%catColors.length]}>
              <div style={{color:catColors[i%catColors.length],fontWeight:700,fontSize:12,marginBottom:8}}>{cat}</div>
              {[["Cost",fmtK(d.cost),P.blue],["Accumulated",fmtK(d.acc),P.orange],["NBV",fmtK(d.nbv),P.green]].map(([l,v,c])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${P.border}20`}}>
                  <span style={{color:P.muted,fontSize:10}}>{l}</span>
                  <span style={{color:c,fontFamily:"monospace",fontSize:11,fontWeight:700}}>{v}</span>
                </div>
              ))}
              <div style={{marginTop:8,height:4,background:P.border,borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:(d.cost>0?d.acc/d.cost*100:0)+"%",background:P.orange,borderRadius:2}}/>
              </div>
              <div style={{color:P.muted,fontSize:9,marginTop:4}}>{d.cost>0?(d.acc/d.cost*100).toFixed(0):0}% depreciated</div>
            </Card>
          ))}
        </div>
      )}

      {tab==="add"&&(
        <Card title="Add Fixed Asset" accent={P.green}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>ASSET NAME *</div><Input value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Office Laptops x5"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>ENTITY</div><Sel value={form.entityId} onChange={v=>setForm(f=>({...f,entityId:v}))} style={{width:"100%"}}>{activeE.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>CATEGORY</div><Sel value={form.category} onChange={v=>setForm(f=>({...f,category:v}))} style={{width:"100%"}}>{ASSET_CATEGORIES.map(c=><option key={c}>{c}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>PURCHASE DATE *</div><Input value={form.purchaseDate} onChange={v=>setForm(f=>({...f,purchaseDate:v}))} type="date"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>COST *</div><Input value={form.cost} onChange={v=>setForm(f=>({...f,cost:v}))} type="number" placeholder="0"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>CURRENCY</div><Sel value={form.currency} onChange={v=>setForm(f=>({...f,currency:v}))} style={{width:"100%"}}>{["MYR","SGD","USD","PHP","IDR"].map(c=><option key={c}>{c}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>USEFUL LIFE (YEARS)</div><Input value={form.usefulLife} onChange={v=>setForm(f=>({...f,usefulLife:v}))} type="number" placeholder="5"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>RESIDUAL VALUE</div><Input value={form.residual} onChange={v=>setForm(f=>({...f,residual:v}))} type="number" placeholder="0"/></div>
            <div style={{gridColumn:"span 2"}}><div style={{color:P.muted,fontSize:9,marginBottom:3}}>NOTES</div><Input value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))} placeholder="Optional notes"/></div>
          </div>
          <div style={{marginTop:12}}><Btn onClick={save} color={P.green}>+ Add Asset</Btn></div>
        </Card>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MODULE 6: HEADCOUNT & PAYROLL COST
// ══════════════════════════════════════════════════════════════════
function HeadcountModule({gf}){
  const {store,setStore}=useStore();
  const {headcount=[],entities,fxRates}=store;
  const [tab,setTab]=useState("roster");
  const spotRow=fxRates[fxRates.length-1]||{};

  function toRM(amt,ccy){if(!amt)return 0;if(ccy===BASE)return amt;if(ccy==="USD")return amt*(spotRow.MYR||4.5);const r=spotRow[ccy],m=spotRow.MYR;return(r&&m)?amt*(m/r):amt;}

  const activeE=entities.filter(e=>e.active&&gf.entityIds.includes(e.id));
  const filtHC=headcount.filter(h=>gf.entityIds.includes(h.entityId)&&h.active);

  const totalHeadcount=filtHC.length;
  const totalMonthlyCost=filtHC.reduce((s,h)=>s+toRM(h.salary,h.currency),0);
  const totalAnnualCost=totalMonthlyCost*12;

  // By entity
  const entityHC=activeE.map(e=>{
    const staff=filtHC.filter(h=>h.entityId===e.id);
    const monthly=staff.reduce((s,h)=>s+toRM(h.salary,h.currency),0);
    return{...e,count:staff.length,monthly,annual:monthly*12};
  });

  // By department
  const deptMap={};
  filtHC.forEach(h=>{
    if(!deptMap[h.department])deptMap[h.department]={count:0,cost:0};
    deptMap[h.department].count++;
    deptMap[h.department].cost+=toRM(h.salary,h.currency);
  });

  // By grade
  const gradeMap={};
  filtHC.forEach(h=>{
    if(!gradeMap[h.grade])gradeMap[h.grade]={count:0,cost:0};
    gradeMap[h.grade].count++;
    gradeMap[h.grade].cost+=toRM(h.salary,h.currency);
  });

  // Chart data
  const deptData=Object.entries(deptMap).map(([dept,d])=>({dept,count:d.count,cost:d.cost}));
  const gradeData=Object.entries(gradeMap).map(([grade,d])=>({grade,count:d.count,cost:d.cost}));
  const entityData=entityHC.map(e=>({name:e.name,count:e.count,monthly:e.monthly}));

  const BLANK={entityId:activeE[0]?.id||"",name:"",title:"",department:DEPARTMENTS[0],grade:GRADES[2],costCentre:"",salary:"",currency:"MYR",startDate:"",employmentType:"Full-time",active:true};
  const [form,setForm]=useState({...BLANK});
  const [editing,setEditing]=useState(null);

  function save(){
    if(!form.name||!form.salary)return;
    const entry={...form,id:form.id||"HC"+Math.random().toString(36).slice(2,7).toUpperCase(),salary:parseFloat(form.salary)};
    const updated=editing?headcount.map(h=>h.id===editing?entry:h):[...headcount,entry];
    const ns={...store,headcount:updated};setStore(ns);persist(ns);setForm({...BLANK});setEditing(null);
  }
  function toggleActive(id){const ns={...store,headcount:headcount.map(h=>h.id===id?{...h,active:!h.active}:h)};setStore(ns);persist(ns);}
  function startEdit(h){setForm({...h,salary:String(h.salary)});setEditing(h.id);setTab("add");}

  const deptColors=[P.blue,P.gold,P.green,P.purple,P.orange,P.red,P.mag,P.blue];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        <KPI label="Total Headcount"    value={totalHeadcount}          color={P.blue}   accent={P.blue}   small/>
        <KPI label="Monthly Payroll"    value={fmtK(totalMonthlyCost)}  color={P.gold}   accent={P.gold}   small/>
        <KPI label="Annual Payroll"     value={fmtK(totalAnnualCost)}   color={P.orange} accent={P.orange} small/>
        <KPI label="Avg Cost / Head"    value={fmtK(totalHeadcount>0?totalMonthlyCost/totalHeadcount:0)} color={P.purple} small sub="per month"/>
        <KPI label="Entities"           value={activeE.length}           color={P.green}  small/>
      </div>

      <SubTabs tabs={[{id:"roster",label:"Headcount Roster"},{id:"cost",label:"Cost Analysis"},{id:"charts",label:"📊 Charts"},{id:"add",label:editing?"Edit Staff":"+ Add Staff"}]} active={tab} onChange={setTab}/>

      {tab==="roster"&&(
        <Card noPad>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:P.surf2}}>{["Name","Entity","Title","Dept","Grade","Type","Monthly Cost","MYR Equiv.",""].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
              <tbody>{filtHC.map((h,i)=>{
                const e=entities.find(x=>x.id===h.entityId);
                const rm=toRM(h.salary,h.currency);
                return(
                  <tr key={h.id} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}12`}}>
                    <td style={{padding:"7px 10px",color:P.text,fontWeight:600}}>{h.name}</td>
                    <td style={{padding:"7px 10px"}}>{e&&<div style={{display:"flex",alignItems:"center",gap:5}}><EntityDot entity={e} size={6}/><span style={{color:e.color,fontSize:10}}>{e.name}</span></div>}</td>
                    <td style={{padding:"7px 10px",color:P.sub,fontSize:10}}>{h.title}</td>
                    <td style={{padding:"7px 10px"}}><Badge label={h.department} color={P.blue}/></td>
                    <td style={{padding:"7px 10px"}}><Badge label={h.grade} color={P.purple}/></td>
                    <td style={{padding:"7px 10px"}}><Badge label={h.employmentType} color={h.employmentType==="Full-time"?P.green:P.gold}/></td>
                    <td style={{padding:"7px 10px",fontFamily:"monospace",color:P.text}}>{fmtAmt(h.salary,h.currency)}</td>
                    <td style={{padding:"7px 10px",fontFamily:"monospace",color:P.gold,fontWeight:700}}>{fmtMYR(rm)}</td>
                    <td style={{padding:"7px 10px",display:"flex",gap:5}}>
                      <Btn onClick={()=>startEdit(h)} small outline color={P.gold}>Edit</Btn>
                      <Btn onClick={()=>toggleActive(h.id)} small outline color={P.muted}>Offboard</Btn>
                    </td>
                  </tr>
                );
              })}</tbody>
              <tfoot><tr style={{background:P.surf2,borderTop:`1px solid ${P.border}`}}>
                <td colSpan={6} style={{padding:"7px 10px",color:P.muted,fontSize:10}}>TOTAL — {filtHC.length} staff</td>
                <td colSpan={2} style={{padding:"7px 10px",fontFamily:"monospace",color:P.gold,fontWeight:700,textAlign:"left"}}>{fmtMYR(totalMonthlyCost)}/mo</td>
                <td/>
              </tr></tfoot>
            </table>
          </div>
        </Card>
      )}

      {tab==="cost"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Card title="Cost by Entity">
              {entityHC.map(e=>(
                <div key={e.id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:`1px solid ${P.border}20`}}>
                  <EntityDot entity={e} size={7}/>
                  <span style={{color:e.color,fontWeight:600,fontSize:11,flex:1}}>{e.name}</span>
                  <span style={{color:P.muted,fontSize:10}}>{e.count} staff</span>
                  <span style={{fontFamily:"monospace",color:P.gold,fontSize:12,fontWeight:700,marginLeft:8}}>{fmtK(e.monthly)}/mo</span>
                </div>
              ))}
            </Card>
            <Card title="Cost by Department">
              {deptData.sort((a,b)=>b.cost-a.cost).map((d,i)=>(
                <div key={d.dept} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${P.border}20`}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:deptColors[i%deptColors.length],flexShrink:0}}/>
                  <span style={{color:P.sub,fontSize:11,flex:1}}>{d.dept}</span>
                  <span style={{color:P.muted,fontSize:10}}>{d.count}</span>
                  <span style={{fontFamily:"monospace",color:P.gold,fontSize:11,fontWeight:700,marginLeft:8}}>{fmtK(d.cost)}</span>
                </div>
              ))}
            </Card>
          </div>
          <Card title="Cost by Grade">
            {gradeData.sort((a,b)=>b.cost-a.cost).map((g,i)=>{
              const pct=totalMonthlyCost>0?g.cost/totalMonthlyCost*100:0;
              return(
                <div key={g.grade} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <span style={{color:P.sub,fontSize:11,width:100}}>{g.grade}</span>
                  <span style={{color:P.muted,fontSize:10,width:30}}>{g.count}</span>
                  <div style={{flex:1,height:8,background:P.border,borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:pct+"%",background:[P.gold,P.blue,P.green,P.purple,P.orange,P.red][i%6],borderRadius:4}}/>
                  </div>
                  <span style={{fontFamily:"monospace",color:P.gold,fontSize:11,fontWeight:700,width:80,textAlign:"right"}}>{fmtK(g.cost)}</span>
                  <span style={{color:P.muted,fontSize:10,width:36,textAlign:"right"}}>{pct.toFixed(0)}%</span>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {tab==="charts"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <InsightPanel title="Headcount & Monthly Cost by Entity">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={entityData} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis dataKey="name" tick={{fill:P.muted,fontSize:10}}/>
                <YAxis yAxisId="left" tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                <YAxis yAxisId="right" orientation="right" tick={{fill:P.muted,fontSize:9}}/>
                <Tooltip formatter={v=>typeof v==="number"&&v>100?fmtMYR(v):v} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Legend formatter={v=><span style={{color:P.muted,fontSize:11}}>{v}</span>}/>
                <Bar yAxisId="left"  dataKey="monthly" name="Monthly Cost (MYR)" fill={P.gold}   radius={[3,3,0,0]}/>
                <Bar yAxisId="right" dataKey="count"   name="Headcount"          fill={P.purple} radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </InsightPanel>
          <InsightPanel title="Payroll Cost Distribution by Department">
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              <ResponsiveContainer width={180} height={180}>
                <PieChart><Pie data={deptData.map(d=>({name:d.dept,value:Math.round(d.cost)}))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                  {deptData.map((_,i)=><Cell key={i} fill={deptColors[i%deptColors.length]}/>)}
                </Pie><Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/></PieChart>
              </ResponsiveContainer>
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:5}}>
                {deptData.sort((a,b)=>b.cost-a.cost).map((d,i)=>(
                  <div key={d.dept} style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:deptColors[i%deptColors.length],flexShrink:0}}/>
                    <span style={{color:P.sub,fontSize:11,flex:1}}>{d.dept}</span>
                    <span style={{fontFamily:"monospace",color:P.gold,fontSize:11,fontWeight:700}}>{fmtK(d.cost)}</span>
                    <span style={{color:P.muted,fontSize:10,width:36,textAlign:"right"}}>{totalMonthlyCost>0?(d.cost/totalMonthlyCost*100).toFixed(0):0}%</span>
                  </div>
                ))}
              </div>
            </div>
          </InsightPanel>
        </div>
      )}

      {tab==="add"&&(
        <Card title={editing?"Edit Staff Record":"Add Staff Member"} accent={editing?P.gold:P.green}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>FULL NAME *</div><Input value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="Name"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>JOB TITLE</div><Input value={form.title} onChange={v=>setForm(f=>({...f,title:v}))} placeholder="Title"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>ENTITY</div><Sel value={form.entityId} onChange={v=>setForm(f=>({...f,entityId:v}))} style={{width:"100%"}}>{activeE.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>DEPARTMENT</div><Sel value={form.department} onChange={v=>setForm(f=>({...f,department:v}))} style={{width:"100%"}}>{DEPARTMENTS.map(d=><option key={d}>{d}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>GRADE</div><Sel value={form.grade} onChange={v=>setForm(f=>({...f,grade:v}))} style={{width:"100%"}}>{GRADES.map(g=><option key={g}>{g}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>EMPLOYMENT TYPE</div><Sel value={form.employmentType} onChange={v=>setForm(f=>({...f,employmentType:v}))} style={{width:"100%"}}>{EMPLOYMENT_TYPES.map(t=><option key={t}>{t}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>MONTHLY SALARY *</div><Input value={form.salary} onChange={v=>setForm(f=>({...f,salary:v}))} type="number" placeholder="0"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>CURRENCY</div><Sel value={form.currency} onChange={v=>setForm(f=>({...f,currency:v}))} style={{width:"100%"}}>{["MYR","SGD","USD","PHP","IDR"].map(c=><option key={c}>{c}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>START DATE</div><Input value={form.startDate} onChange={v=>setForm(f=>({...f,startDate:v}))} type="date"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>COST CENTRE</div><Input value={form.costCentre} onChange={v=>setForm(f=>({...f,costCentre:v}))} placeholder="e.g. Operations"/></div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <Btn onClick={save} color={editing?P.gold:P.green}>{editing?"Save Changes":"+ Add Staff"}</Btn>
            {editing&&<Btn onClick={()=>{setForm({...BLANK});setEditing(null);}} outline color={P.muted}>Cancel</Btn>}
          </div>
        </Card>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// FinFlow P2P Suite — Procure-to-Pay (6 Modules)
// Vendor Master → PR → PO → GR → Invoice/3-Way Match → Payment Run
// ══════════════════════════════════════════════════════════════════

// ── Constants ─────────────────────────────────────────────────────
const VENDOR_CATEGORIES = ["Professional Services","IT & Technology","Office Supplies","Utilities","Facilities","Training & Events","Marketing","Logistics","Legal","Finance","Other"];
const VENDOR_TIERS      = ["Strategic","Preferred","Approved","One-time"];
const VENDOR_STATUSES   = ["Active","Inactive","Blacklisted"];
const RISK_RATINGS      = ["Low","Medium","High"];
const PAYMENT_TERMS     = ["Net 30","Net 60","Net 90","Net 15","COD","Immediate"];
const PR_STATUSES       = ["Draft","Submitted","Approved","Rejected","Converted"];
const PO_STATUSES       = ["Draft","Issued","Partially Received","Fully Received","Closed","Cancelled"];
const GR_STATUSES       = ["Partial","Complete"];
const INV_STATUSES      = ["Pending","Matched","Price Variance","Qty Variance","No PO","Approved","Rejected"];
const PAY_STATUSES      = ["Draft","Approved","Processed"];
const MATCH_CLR         = {Matched:P.green,"Price Variance":P.orange,"Qty Variance":P.orange,"No PO":P.red,Pending:P.muted,Approved:P.blue,Rejected:P.red};

// ── Default vendor data ───────────────────────────────────────────
const DEFAULT_VENDORS_BASE = [
  {id:"V001",name:"OTG Singapore Pte Ltd",tradingName:"OTG",country:"Singapore",currency:"SGD",category:"IT & Technology",tier:"Strategic",contactName:"OTG Admin",email:"admin@otg.sg",phone:"+65 6555 1234",paymentTerms:"Net 30",taxRegNo:"201234567A",bankName:"DBS Singapore",bankAccount:"0123-456789-01",bankSwift:"DBSSSGSG",status:"Active",riskRating:"Low",isIC:true,entityId:"E002",notes:"Silent tech partner for SGC Solutions",createdAt:"2023-01-01"},
  {id:"V002",name:"Adobe Inc",tradingName:"Adobe",country:"United States",currency:"USD",category:"IT & Technology",tier:"Preferred",contactName:"Adobe Support",email:"support@adobe.com",phone:"+1 800 833 6687",paymentTerms:"Net 30",taxRegNo:"",bankName:"",bankAccount:"",bankSwift:"",status:"Active",riskRating:"Low",isIC:false,entityId:"",notes:"Creative Cloud subscription",createdAt:"2023-01-01"},
  {id:"V003",name:"Local Trainer MNL",tradingName:"Local Trainer",country:"Philippines",currency:"PHP",category:"Professional Services",tier:"Approved",contactName:"Maria Santos",email:"maria@localtrainer.ph",phone:"+63 917 555 1234",paymentTerms:"Net 15",taxRegNo:"123-456-789",bankName:"BDO Philippines",bankAccount:"1234-5678-90",bankSwift:"BNORPHMM",status:"Active",riskRating:"Medium",isIC:false,entityId:"",notes:"Philippines delivery support",createdAt:"2023-06-01"},
  {id:"V004",name:"KL Office Supplies Sdn Bhd",tradingName:"KLOS",country:"Malaysia",currency:"MYR",category:"Office Supplies",tier:"Approved",contactName:"Ahmad",email:"ahmad@klos.com.my",phone:"+60 3 2222 3333",paymentTerms:"Net 30",taxRegNo:"SST123456",bankName:"Maybank",bankAccount:"1234-5678-9012",bankSwift:"MBBEMYKL",status:"Active",riskRating:"Low",isIC:false,entityId:"",notes:"Stationery and pantry supplies",createdAt:"2022-06-01"},
  {id:"V005",name:"SG Cowork Space Pte",tradingName:"SGCowork",country:"Singapore",currency:"SGD",category:"Facilities",tier:"Preferred",contactName:"Rachel Tan",email:"rachel@sgcowork.sg",phone:"+65 6333 9999",paymentTerms:"Net 30",taxRegNo:"201987654B",bankName:"OCBC Singapore",bankAccount:"5678-901234-56",bankSwift:"OCBCSGSG",status:"Active",riskRating:"Low",isIC:false,entityId:"",notes:"Singapore office rental",createdAt:"2021-06-01"},
];
const DEFAULT_VENDORS = [...DEFAULT_VENDORS_BASE, ...MOCK_VENDORS_EXTRA];


// ── Default PRs ───────────────────────────────────────────────────
const DEFAULT_PRS = [
  {id:"PR001",vendorId:"V004",entityId:"E001",prNumber:"PR-2024-001",requestor:"Finance Manager",department:"Finance",costCentre:"Finance",items:[{description:"A4 Paper Reams x50",qty:50,unitCost:8.5,unit:"ream"},{description:"Printer Toner Cartridges x4",qty:4,unitCost:120,unit:"unit"}],estimatedTotal:905,currency:"MYR",requiredDate:"2024-12-15",status:"Approved",notes:"Monthly office supplies",approvedBy:"Lawrence Liu",approvedAt:"2024-12-02",poId:"PO001"},
  {id:"PR002",vendorId:"V003",entityId:"E003",prNumber:"PR-2024-002",requestor:"PH Country Head",department:"Training",costCentre:"Operations",items:[{description:"Training delivery support — Dec workshop",qty:1,unitCost:85000,unit:"engagement"}],estimatedTotal:85000,currency:"PHP",requiredDate:"2024-12-20",status:"Submitted",notes:"Quarterly training delivery partner",approvedBy:"",approvedAt:"",poId:""},
  {id:"PR003",vendorId:"V001",entityId:"E001",prNumber:"PR-2025-001",requestor:"Lawrence Liu",department:"Technology",costCentre:"Operations",items:[{description:"AI Solutions development — Jan 2025",qty:1,unitCost:22000,unit:"month"}],estimatedTotal:22000,currency:"SGD",requiredDate:"2025-01-31",status:"Draft",notes:"Monthly dev retainer",approvedBy:"",approvedAt:"",poId:""},
];

// ── Default POs ───────────────────────────────────────────────────
const DEFAULT_POS = [
  {id:"PO001",prId:"PR001",vendorId:"V004",entityId:"E001",poNumber:"PO-2024-001",items:[{description:"A4 Paper Reams x50",qty:50,unitPrice:8.5,unit:"ream",glAccount:"5400"},{description:"Printer Toner Cartridges x4",qty:4,unitPrice:120,unit:"unit",glAccount:"5400"}],currency:"MYR",total:905,deliveryDate:"2024-12-15",issuedDate:"2024-12-03",status:"Fully Received",terms:"Net 30",notes:""},
  {id:"PO002",prId:"",vendorId:"V001",entityId:"E001",poNumber:"PO-2024-002",items:[{description:"AI Solutions development — Dec 2024",qty:1,unitPrice:22000,unit:"month",glAccount:"5400"}],currency:"SGD",total:22000,deliveryDate:"2024-12-31",issuedDate:"2024-12-01",status:"Fully Received",terms:"Net 30",notes:"Monthly retainer"},
  {id:"PO003",prId:"",vendorId:"V005",entityId:"E002",poNumber:"PO-2024-003",items:[{description:"Office rental — Dec 2024",qty:1,unitPrice:4800,unit:"month",glAccount:"5400"}],currency:"SGD",total:4800,deliveryDate:"2024-12-31",issuedDate:"2024-12-01",status:"Fully Received",terms:"Net 30",notes:"Monthly office rental"},
];

// ── Default GRs ───────────────────────────────────────────────────
const DEFAULT_GRS = [
  {id:"GR001",poId:"PO001",vendorId:"V004",entityId:"E001",grNumber:"GR-2024-001",receivedDate:"2024-12-14",receivedBy:"Office Admin",items:[{description:"A4 Paper Reams x50",qtyOrdered:50,qtyReceived:50},{description:"Printer Toner Cartridges x4",qtyOrdered:4,qtyReceived:4}],status:"Complete",notes:"All items received in good condition"},
  {id:"GR002",poId:"PO002",vendorId:"V001",entityId:"E001",grNumber:"GR-2024-002",receivedDate:"2024-12-31",receivedBy:"Lawrence Liu",items:[{description:"AI Solutions development — Dec 2024",qtyOrdered:1,qtyReceived:1}],status:"Complete",notes:"Service delivered, milestone approved"},
  {id:"GR003",poId:"PO003",vendorId:"V005",entityId:"E002",grNumber:"GR-2024-003",receivedDate:"2024-12-31",receivedBy:"SG Office Manager",items:[{description:"Office rental — Dec 2024",qtyOrdered:1,qtyReceived:1}],status:"Complete",notes:""},
];

// ── Default Supplier Invoices ─────────────────────────────────────
const DEFAULT_INVOICES = [
  {id:"INV001",vendorId:"V001",entityId:"E001",invoiceNumber:"OTG-2024-120",invoiceDate:"2024-12-31",dueDate:"2025-01-30",poId:"PO002",grId:"GR002",currency:"SGD",amount:22000,lineItems:[{description:"AI Solutions development — Dec 2024",qty:1,unitPrice:22000,glAccount:"5400"}],matchStatus:"Matched",matchNotes:"",approvedBy:"Lawrence Liu",approvedAt:"2024-12-31",apRecordId:"AP-001",status:"Approved"},
  {id:"INV002",vendorId:"V004",entityId:"E001",invoiceNumber:"KLOS-INV-8821",invoiceDate:"2024-12-14",dueDate:"2025-01-13",poId:"PO001",grId:"GR001",currency:"MYR",amount:910,lineItems:[{description:"Office supplies Dec 2024",qty:1,unitPrice:910,glAccount:"5400"}],matchStatus:"Price Variance",matchNotes:"Invoice RM910 vs PO RM905 — RM5 variance (0.6%)",approvedBy:"",approvedAt:"",apRecordId:"",status:"Pending"},
  {id:"INV003",vendorId:"V005",entityId:"E002",invoiceNumber:"SGC-DEC-2024",invoiceDate:"2024-12-31",dueDate:"2025-01-30",poId:"PO003",grId:"GR003",currency:"SGD",amount:4800,lineItems:[{description:"Office rental Dec 2024",qty:1,unitPrice:4800,glAccount:"5400"}],matchStatus:"Matched",matchNotes:"",approvedBy:"SG Office Manager",approvedAt:"2024-12-31",apRecordId:"",status:"Approved"},
];

// ── Default Payment Runs ──────────────────────────────────────────
const DEFAULT_PAYMENT_RUNS = [
  {id:"PAY001",entityId:"E001",runDate:"2025-01-15",currency:"SGD",batchRef:"PAY-JAN25-001",payments:[{invoiceId:"INV001",vendorId:"V001",amount:22000,currency:"SGD"}],totalAmount:22000,status:"Processed",processedBy:"Lawrence Liu",processedAt:"2025-01-15",glJournalId:"JE-PAY-001"},
];

// ── Auto ID generator ─────────────────────────────────────────────
function autoId(prefix){ return prefix+Math.random().toString(36).slice(2,8).toUpperCase(); }

// ── Spend analytics helpers ───────────────────────────────────────
function vendorSpend(vendorId, invoices, fxRates){
  const spotRow = fxRates[fxRates.length-1]||{};
  function toRM(amt,ccy){
    if(ccy===BASE)return amt;
    if(ccy==="USD")return amt*(spotRow.MYR||4.5);
    const r=spotRow[ccy],m=spotRow.MYR;
    return(r&&m)?amt*(m/r):amt;
  }
  return invoices
    .filter(i=>i.vendorId===vendorId&&["Approved","Matched"].includes(i.status))
    .reduce((s,i)=>s+toRM(i.amount,i.currency),0);
}

function vendorMatchRate(vendorId, invoices){
  const vInv=invoices.filter(i=>i.vendorId===vendorId);
  if(!vInv.length) return null;
  const matched=vInv.filter(i=>i.matchStatus==="Matched").length;
  return+(matched/vInv.length*100).toFixed(0);
}

function vendorOnTimeRate(vendorId, pos, grs){
  const vPOs=pos.filter(p=>p.vendorId===vendorId&&p.deliveryDate);
  if(!vPOs.length) return null;
  const onTime=vPOs.filter(p=>{
    const gr=grs.find(g=>g.poId===p.id);
    if(!gr) return false;
    return gr.receivedDate<=p.deliveryDate;
  }).length;
  return+(onTime/vPOs.length*100).toFixed(0);
}

// ══════════════════════════════════════════════════════════════════
// MODULE P1: VENDOR MASTER
// ══════════════════════════════════════════════════════════════════
function VendorMasterModule({gf,prefill,clearPrefill}){
  const {store,setStore}=useStore();
  const {vendors=[],supplierInvoices=[],purchaseOrders=[],goodsReceipts=[],fxRates,entities}=store;
  const [tab,setTab]=useState("list");
  const [search,setSearch]=useState("");
  const [fStatus,setFStatus]=useState("All");
  const [fTier,setFTier]=useState("All");
  const [selected,setSelected]=useState(null); // vendor detail view

  const BLANK={id:"",name:"",tradingName:"",country:"Malaysia",currency:"MYR",category:VENDOR_CATEGORIES[0],tier:"Approved",contactName:"",email:"",phone:"",paymentTerms:"Net 30",taxRegNo:"",bankName:"",bankAccount:"",bankSwift:"",status:"Active",riskRating:"Low",isIC:false,entityId:"",notes:""};
  const [form,setForm]=useState({...BLANK});
  const [editing,setEditing]=useState(null);

  const filtVendors=vendors.filter(v=>{
    if(fStatus!=="All"&&v.status!==fStatus) return false;
    if(fTier!=="All"&&v.tier!==fTier) return false;
    if(search&&!v.name.toLowerCase().includes(search.toLowerCase())&&!v.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function save(){
    if(!form.name.trim()) return;
    const v={...form,id:form.id||autoId("V"),createdAt:form.createdAt||new Date().toISOString().slice(0,10)};
    const updated=editing?vendors.map(x=>x.id===editing?v:x):[...vendors,v];
    const ns={...store,vendors:updated};setStore(ns);persist(ns);
    setForm({...BLANK});setEditing(null);setTab("list");
  }
  function startEdit(v){setForm({...v});setEditing(v.id);setTab("add");}
  function toggleStatus(id){
    const v=vendors.find(x=>x.id===id);
    const next=v.status==="Active"?"Inactive":"Active";
    const ns={...store,vendors:vendors.map(x=>x.id===id?{...x,status:next}:x)};
    setStore(ns);persist(ns);
  }

  const statusClr={Active:P.green,Inactive:P.muted,Blacklisted:P.red};
  const tierClr={Strategic:P.gold,Preferred:P.blue,Approved:P.green,"One-time":P.muted};
  const riskClr={Low:P.green,Medium:P.orange,High:P.red};

  // Spend summary
  const spotRow=fxRates[fxRates.length-1]||{};
  function toRM(amt,ccy){if(ccy===BASE)return amt;if(ccy==="USD")return amt*(spotRow.MYR||4.5);const r=spotRow[ccy],m=spotRow.MYR;return(r&&m)?amt*(m/r):amt;}
  const totalSpend=supplierInvoices.filter(i=>["Approved","Matched"].includes(i.status)).reduce((s,i)=>s+toRM(i.amount,i.currency),0);
  const activeVendors=vendors.filter(v=>v.status==="Active").length;
  const strategicVendors=vendors.filter(v=>v.tier==="Strategic").length;
  const pendingInvCount=supplierInvoices.filter(i=>i.status==="Pending").length;

  // Top vendors by spend for analytics
  const vendorSpendData=vendors.map(v=>({
    ...v,
    spend:vendorSpend(v.id,supplierInvoices,fxRates),
    matchRate:vendorMatchRate(v.id,supplierInvoices),
    onTimeRate:vendorOnTimeRate(v.id,purchaseOrders,goodsReceipts),
    invoiceCount:supplierInvoices.filter(i=>i.vendorId===v.id).length,
    poCount:purchaseOrders.filter(p=>p.vendorId===v.id).length,
  })).sort((a,b)=>b.spend-a.spend);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        <KPI label="Total Vendors"     value={vendors.length}     color={P.blue}   accent={P.blue}   small/>
        <KPI label="Active"            value={activeVendors}      color={P.green}  accent={P.green}  small/>
        <KPI label="Strategic"         value={strategicVendors}   color={P.gold}   accent={P.gold}   small/>
        <KPI label="Total Spend (MYR)" value={fmtK(totalSpend)}   color={P.mag}    accent={P.mag}    small/>
        <KPI label="Pending Invoices"  value={pendingInvCount}    color={pendingInvCount>0?P.orange:P.green} small/>
      </div>

      <SubTabs tabs={[{id:"list",label:"Vendor List"},{id:"analytics",label:"Spend Analytics"},{id:"performance",label:"Performance"},{id:"add",label:editing?"Edit Vendor":"+ New Vendor"}]} active={tab} onChange={setTab}/>

      {tab==="list"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <Input value={search} onChange={setSearch} placeholder="Search vendor name or category…" style={{width:220}}/>
            <Sel value={fStatus} onChange={setFStatus} style={{width:120}}>
              <option value="All">All Status</option>
              {VENDOR_STATUSES.map(s=><option key={s}>{s}</option>)}
            </Sel>
            <Sel value={fTier} onChange={setFTier} style={{width:130}}>
              <option value="All">All Tiers</option>
              {VENDOR_TIERS.map(t=><option key={t}>{t}</option>)}
            </Sel>
            <span style={{color:P.muted,fontSize:11,marginLeft:"auto"}}>{filtVendors.length} vendors</span>
          </div>
          <Card noPad>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:P.surf2}}>
                  {["Vendor","Category","Country","Currency","Tier","Payment Terms","Risk","Status","Spend MYR",""].map(h=>(
                    <th key={h} style={{padding:"7px 10px",textAlign:"left",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{filtVendors.map((v,i)=>{
                  const spend=vendorSpend(v.id,supplierInvoices,fxRates);
                  return(
                    <tr key={v.id} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}12`,cursor:"pointer"}} onClick={()=>{setSelected(v);setTab("performance");}}>
                      <td style={{padding:"8px 10px"}}>
                        <div style={{color:P.text,fontWeight:600,fontSize:12}}>{v.name}</div>
                        {v.tradingName&&v.tradingName!==v.name&&<div style={{color:P.muted,fontSize:9}}>{v.tradingName}</div>}
                        {v.isIC&&<Badge label="IC Entity" color={P.purple}/>}
                      </td>
                      <td style={{padding:"8px 10px",color:P.sub,fontSize:10}}>{v.category}</td>
                      <td style={{padding:"8px 10px",color:P.muted,fontSize:10}}>{v.country}</td>
                      <td style={{padding:"8px 10px"}}><Badge label={v.currency} color={CCY_CLR[v.currency]||P.muted}/></td>
                      <td style={{padding:"8px 10px"}}><Badge label={v.tier} color={tierClr[v.tier]}/></td>
                      <td style={{padding:"8px 10px",color:P.muted,fontSize:10}}>{v.paymentTerms}</td>
                      <td style={{padding:"8px 10px"}}><Badge label={v.riskRating} color={riskClr[v.riskRating]}/></td>
                      <td style={{padding:"8px 10px"}}><Badge label={v.status} color={statusClr[v.status]}/></td>
                      <td style={{padding:"8px 10px",fontFamily:"monospace",color:P.gold,fontWeight:700}}>{spend>0?fmtK(spend):"—"}</td>
                      <td style={{padding:"8px 10px"}}>
                        <div style={{display:"flex",gap:4}} onClick={e=>e.stopPropagation()}>
                          <Btn onClick={()=>startEdit(v)} small outline color={P.gold}>Edit</Btn>
                          <Btn onClick={()=>toggleStatus(v.id)} small outline color={v.status==="Active"?P.muted:P.green}>{v.status==="Active"?"Deactivate":"Activate"}</Btn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtVendors.length===0&&<tr><td colSpan={10} style={{padding:24,textAlign:"center",color:P.muted}}>No vendors found. Add one using + New Vendor.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {tab==="analytics"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <InsightPanel title="Top Vendors by Spend (MYR)">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={vendorSpendData.filter(v=>v.spend>0).slice(0,8).map(v=>({name:v.name.length>20?v.name.slice(0,18)+"…":v.name,spend:v.spend}))} layout="vertical" margin={{top:0,right:80,left:140,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                <XAxis type="number" tick={{fill:P.muted,fontSize:9}} tickFormatter={v=>fmtK(v)}/>
                <YAxis dataKey="name" type="category" tick={{fill:P.muted,fontSize:10}} width={140}/>
                <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                <Bar dataKey="spend" name="Spend MYR" radius={[0,4,4,0]}>
                  {vendorSpendData.filter(v=>v.spend>0).slice(0,8).map((_,i)=><Cell key={i} fill={[P.gold,P.blue,P.green,P.purple,P.orange,P.mag,P.red,P.blue][i%8]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </InsightPanel>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <InsightPanel title="Spend by Category">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={(()=>{const catMap={};vendors.forEach(v=>{const s=vendorSpend(v.id,supplierInvoices,fxRates);if(s>0)catMap[v.category]=(catMap[v.category]||0)+s;});return Object.entries(catMap).map(([name,value])=>({name,value}));})()}
                    dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={35}>
                    {VENDOR_CATEGORIES.map((_,i)=><Cell key={i} fill={[P.gold,P.blue,P.green,P.purple,P.orange,P.mag,P.red,P.blue,"#06B6D4","#84CC16","#F59E0B"][i%11]}/>)}
                  </Pie>
                  <Tooltip formatter={v=>fmtMYR(v)} contentStyle={{background:"#1A2235",border:`1px solid ${P.border}`,borderRadius:8,fontSize:11}}/>
                  <Legend formatter={v=><span style={{color:P.muted,fontSize:10}}>{v}</span>}/>
                </PieChart>
              </ResponsiveContainer>
            </InsightPanel>
            <InsightPanel title="Vendors by Tier">
              <div style={{display:"flex",flexDirection:"column",gap:10,paddingTop:8}}>
                {VENDOR_TIERS.map(tier=>{
                  const count=vendors.filter(v=>v.tier===tier).length;
                  const spend=vendors.filter(v=>v.tier===tier).reduce((s,v)=>s+vendorSpend(v.id,supplierInvoices,fxRates),0);
                  return count>0?(
                    <div key={tier} style={{display:"flex",alignItems:"center",gap:10}}>
                      <Badge label={tier} color={tierClr[tier]}/>
                      <div style={{flex:1,height:6,background:P.border,borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:vendors.length>0?(count/vendors.length*100)+"%":"0%",background:tierClr[tier],borderRadius:3}}/>
                      </div>
                      <span style={{color:P.sub,fontSize:11,width:16,textAlign:"center"}}>{count}</span>
                      <span style={{color:P.gold,fontFamily:"monospace",fontSize:11,width:80,textAlign:"right"}}>{spend>0?fmtK(spend):"—"}</span>
                    </div>
                  ):null;
                })}
              </div>
            </InsightPanel>
          </div>
        </div>
      )}

      {tab==="performance"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {selected&&(
            <Card title={"Vendor Detail — "+selected.name} accent={tierClr[selected.tier]}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
                {[
                  {label:"Total Spend",value:fmtK(vendorSpend(selected.id,supplierInvoices,fxRates)),color:P.gold},
                  {label:"Invoice Match Rate",value:(vendorMatchRate(selected.id,supplierInvoices)||0)+"%",color:vendorMatchRate(selected.id,supplierInvoices)>=80?P.green:P.orange},
                  {label:"On-Time Delivery",value:(vendorOnTimeRate(selected.id,purchaseOrders,goodsReceipts)||0)+"%",color:vendorOnTimeRate(selected.id,purchaseOrders,goodsReceipts)>=80?P.green:P.orange},
                  {label:"Invoices",value:supplierInvoices.filter(i=>i.vendorId===selected.id).length,color:P.blue},
                  {label:"POs Raised",value:purchaseOrders.filter(p=>p.vendorId===selected.id).length,color:P.purple},
                  {label:"Payment Terms",value:selected.paymentTerms,color:P.sub},
                ].map(k=>(
                  <div key={k.label} style={{background:P.surf2,borderRadius:9,padding:"10px 12px",border:`1px solid ${P.border}`}}>
                    <div style={{color:P.muted,fontSize:9,letterSpacing:1.5,marginBottom:4}}>{k.label.toUpperCase()}</div>
                    <div style={{color:k.color,fontFamily:"monospace",fontSize:15,fontWeight:700}}>{k.value}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:11,color:P.sub}}>
                <div>
                  <div style={{color:P.muted,fontSize:9,marginBottom:6,letterSpacing:1.5}}>CONTACT DETAILS</div>
                  {[["Contact",selected.contactName],["Email",selected.email],["Phone",selected.phone],["Country",selected.country],["Tax Reg",selected.taxRegNo||"—"]].map(([l,v])=>(
                    <div key={l} style={{display:"flex",gap:8,padding:"4px 0",borderBottom:`1px solid ${P.border}20`}}>
                      <span style={{color:P.muted,width:60,flexShrink:0}}>{l}</span>
                      <span style={{color:P.text}}>{v||"—"}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{color:P.muted,fontSize:9,marginBottom:6,letterSpacing:1.5}}>BANK & PAYMENT</div>
                  {[["Bank",selected.bankName||"—"],["Account",selected.bankAccount||"—"],["SWIFT",selected.bankSwift||"—"],["Terms",selected.paymentTerms],["Risk",selected.riskRating]].map(([l,v])=>(
                    <div key={l} style={{display:"flex",gap:8,padding:"4px 0",borderBottom:`1px solid ${P.border}20`}}>
                      <span style={{color:P.muted,width:60,flexShrink:0}}>{l}</span>
                      <span style={{color:l==="Risk"?riskClr[v]:P.text}}>{v||"—"}</span>
                    </div>
                  ))}
                </div>
              </div>
              {selected.notes&&<div style={{marginTop:10,padding:"8px 10px",background:P.surf2,borderRadius:8,fontSize:11,color:P.muted,fontStyle:"italic"}}>{selected.notes}</div>}
              <div style={{marginTop:10}}><Btn onClick={()=>startEdit(selected)} small outline color={P.gold}>Edit Vendor</Btn></div>
            </Card>
          )}
          <Card noPad title="All Vendor Performance Scorecard">
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:P.surf2}}>
                {["Vendor","Tier","Risk","Spend MYR","Invoices","Match Rate","On-Time",""].map(h=>(
                  <th key={h} style={{padding:"7px 10px",textAlign:"left",color:P.muted,borderBottom:`1px solid ${P.border}`,fontSize:10,letterSpacing:1,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{vendorSpendData.map((v,i)=>{
                const mr=vendorMatchRate(v.id,supplierInvoices);
                const ot=vendorOnTimeRate(v.id,purchaseOrders,goodsReceipts);
                return(
                  <tr key={v.id} style={{borderBottom:`1px solid ${P.border}20`,background:i%2===0?"transparent":`${P.border}12`,cursor:"pointer"}} onClick={()=>setSelected(v)}>
                    <td style={{padding:"7px 10px",color:P.text,fontWeight:600}}>{v.name}</td>
                    <td style={{padding:"7px 10px"}}><Badge label={v.tier} color={tierClr[v.tier]}/></td>
                    <td style={{padding:"7px 10px"}}><Badge label={v.riskRating} color={riskClr[v.riskRating]}/></td>
                    <td style={{padding:"7px 10px",fontFamily:"monospace",color:P.gold,fontWeight:700}}>{v.spend>0?fmtK(v.spend):"—"}</td>
                    <td style={{padding:"7px 10px",color:P.sub}}>{v.invoiceCount}</td>
                    <td style={{padding:"7px 10px",color:mr===null?P.muted:mr>=80?P.green:P.orange,fontFamily:"monospace",fontWeight:600}}>{mr===null?"—":mr+"%"}</td>
                    <td style={{padding:"7px 10px",color:ot===null?P.muted:ot>=80?P.green:P.orange,fontFamily:"monospace",fontWeight:600}}>{ot===null?"—":ot+"%"}</td>
                    <td style={{padding:"7px 10px"}}><Btn onClick={e=>{e.stopPropagation();setSelected(v);}} small outline color={P.blue}>Detail</Btn></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </Card>
        </div>
      )}

      {tab==="add"&&(
        <Card title={editing?"Edit Vendor":"Add New Vendor"} accent={editing?P.gold:P.green}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            <div style={{gridColumn:"span 2"}}><div style={{color:P.muted,fontSize:9,marginBottom:3}}>LEGAL NAME *</div><Input value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="Legal registered name"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>TRADING NAME</div><Input value={form.tradingName} onChange={v=>setForm(f=>({...f,tradingName:v}))} placeholder="Short / trading name"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>CATEGORY</div><Sel value={form.category} onChange={v=>setForm(f=>({...f,category:v}))} style={{width:"100%"}}>{VENDOR_CATEGORIES.map(c=><option key={c}>{c}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>TIER</div><Sel value={form.tier} onChange={v=>setForm(f=>({...f,tier:v}))} style={{width:"100%"}}>{VENDOR_TIERS.map(t=><option key={t}>{t}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>RISK RATING</div><Sel value={form.riskRating} onChange={v=>setForm(f=>({...f,riskRating:v}))} style={{width:"100%"}}>{RISK_RATINGS.map(r=><option key={r}>{r}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>COUNTRY</div><Sel value={form.country} onChange={v=>setForm(f=>({...f,country:v}))} style={{width:"100%"}}>{COUNTRIES.map(c=><option key={c}>{c}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>CURRENCY</div><Sel value={form.currency} onChange={v=>setForm(f=>({...f,currency:v}))} style={{width:"100%"}}>{CCY_LIST.map(c=><option key={c}>{c}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>PAYMENT TERMS</div><Sel value={form.paymentTerms} onChange={v=>setForm(f=>({...f,paymentTerms:v}))} style={{width:"100%"}}>{PAYMENT_TERMS.map(t=><option key={t}>{t}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>CONTACT NAME</div><Input value={form.contactName} onChange={v=>setForm(f=>({...f,contactName:v}))} placeholder="Primary contact"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>EMAIL</div><Input value={form.email} onChange={v=>setForm(f=>({...f,email:v}))} placeholder="vendor@email.com"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>PHONE</div><Input value={form.phone} onChange={v=>setForm(f=>({...f,phone:v}))} placeholder="+60 3 1234 5678"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>TAX REG NO</div><Input value={form.taxRegNo} onChange={v=>setForm(f=>({...f,taxRegNo:v}))} placeholder="SST/GST/VAT no."/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>BANK NAME</div><Input value={form.bankName} onChange={v=>setForm(f=>({...f,bankName:v}))} placeholder="Bank name"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>BANK ACCOUNT</div><Input value={form.bankAccount} onChange={v=>setForm(f=>({...f,bankAccount:v}))} placeholder="Account number"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>SWIFT / BIC</div><Input value={form.bankSwift} onChange={v=>setForm(f=>({...f,bankSwift:v}))} placeholder="SWIFT code"/></div>
            <div style={{display:"flex",alignItems:"center",gap:8,paddingTop:16}}>
              <input type="checkbox" id="isIC" checked={form.isIC} onChange={e=>setForm(f=>({...f,isIC:e.target.checked}))}/>
              <label htmlFor="isIC" style={{color:P.muted,fontSize:11,cursor:"pointer"}}>Intercompany entity</label>
            </div>
            <div style={{gridColumn:"span 2"}}><div style={{color:P.muted,fontSize:9,marginBottom:3}}>NOTES</div><Input value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))} placeholder="Internal notes"/></div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <Btn onClick={save} disabled={!form.name} color={editing?P.gold:P.green}>{editing?"Save Changes":"Add Vendor"}</Btn>
            {editing&&<Btn onClick={()=>{setForm({...BLANK});setEditing(null);setTab("list");}} outline color={P.muted}>Cancel</Btn>}
          </div>
        </Card>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MODULE P2: PURCHASE REQUISITION (PR)
// ══════════════════════════════════════════════════════════════════
function PRModule({gf}){
  const {store,setStore}=useStore();
  const {purchaseReqs=[],purchaseOrders=[],vendors=[],entities,fxRates,budget}=store;
  const [tab,setTab]=useState("list");
  const [fStatus,setFStatus]=useState("All");
  const activeE=entities.filter(e=>e.active&&gf.entityIds.includes(e.id));
  const activeVendors=vendors.filter(v=>v.status==="Active");
  const spotRow=fxRates[fxRates.length-1]||{};
  function toRM(amt,ccy){if(ccy===BASE)return amt;if(ccy==="USD")return amt*(spotRow.MYR||4.5);const r=spotRow[ccy],m=spotRow.MYR;return(r&&m)?amt*(m/r):amt;}

  const BLANK_PR={vendorId:"",entityId:activeE[0]?.id||"",requestor:"",department:"",costCentre:"",items:[{description:"",qty:1,unitCost:"",unit:"unit"}],currency:"MYR",requiredDate:"",notes:""};
  const [form,setForm]=useState({...BLANK_PR});
  const [editing,setEditing]=useState(null);

  const filtPRs=purchaseReqs.filter(p=>{
    if(!gf.entityIds.includes(p.entityId)) return false;
    if(fStatus!=="All"&&p.status!==fStatus) return false;
    return true;
  });

  function calcTotal(items,ccy){return items.reduce((s,i)=>s+(parseFloat(i.qty)||0)*(parseFloat(i.unitCost)||0),0);}

  function addItem(){setForm(f=>({...f,items:[...f.items,{description:"",qty:1,unitCost:"",unit:"unit"}]}));}
  function removeItem(idx){setForm(f=>({...f,items:f.items.filter((_,i)=>i!==idx)}));}
  function updateItem(idx,field,val){setForm(f=>({...f,items:f.items.map((it,i)=>i===idx?{...it,[field]:val}:it)}));}

  function save(status="Draft"){
    if(!form.entityId||!form.requestor||!form.items[0].description) return;
    const total=calcTotal(form.items,form.currency);
    const pr={...form,id:form.id||autoId("PR"),prNumber:form.prNumber||"PR-"+new Date().getFullYear()+"-"+String(purchaseReqs.length+1).padStart(3,"0"),estimatedTotal:total,status,approvedBy:"",approvedAt:"",poId:""};
    const updated=editing?purchaseReqs.map(p=>p.id===editing?pr:p):[...purchaseReqs,pr];
    const ns={...store,purchaseReqs:updated};setStore(ns);persist(ns);
    setForm({...BLANK_PR});setEditing(null);setTab("list");
  }

  function updateStatus(id,status,extra={}){
    const updated=purchaseReqs.map(p=>p.id===id?{...p,status,...extra}:p);
    const ns={...store,purchaseReqs:updated};setStore(ns);persist(ns);
  }

  function approve(id){updateStatus(id,"Approved",{approvedBy:"Current User",approvedAt:new Date().toISOString().slice(0,10)});}
  function reject(id){updateStatus(id,"Rejected");}
  function submit(id){updateStatus(id,"Submitted");}

  // Convert PR to PO
  function convertToPO(pr){
    const po={
      id:autoId("PO"),prId:pr.id,vendorId:pr.vendorId,entityId:pr.entityId,
      poNumber:"PO-"+new Date().getFullYear()+"-"+String(purchaseOrders.length+1).padStart(3,"0"),
      items:pr.items.map(i=>({...i,unitPrice:parseFloat(i.unitCost)||0,glAccount:"5400"})),
      currency:pr.currency,total:pr.estimatedTotal,
      deliveryDate:pr.requiredDate,issuedDate:new Date().toISOString().slice(0,10),
      status:"Issued",terms:(vendors.find(v=>v.id===pr.vendorId)?.paymentTerms||"Net 30"),notes:"From "+pr.prNumber,
    };
    const newPOs=[...(store.purchaseOrders||[]),po];
    const newPRs=purchaseReqs.map(p=>p.id===pr.id?{...p,status:"Converted",poId:po.id}:p);
    const ns={...store,purchaseOrders:newPOs,purchaseReqs:newPRs};setStore(ns);persist(ns);
  }

  const statusClr={Draft:P.muted,Submitted:P.blue,Approved:P.green,Rejected:P.red,Converted:P.purple};
  const periods=fxRates.map(r=>r.period);
  const curPeriod=periods[periods.length-1]||"";

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10}}>
        {PR_STATUSES.map(s=>{const c=purchaseReqs.filter(p=>p.status===s&&gf.entityIds.includes(p.entityId)).length;return c>0||s==="Submitted"?(<KPI key={s} label={s} value={c} color={statusClr[s]} small/>):null;})}
      </div>

      <SubTabs tabs={[{id:"list",label:"All PRs"},{id:"add",label:editing?"Edit PR":"+ New PR"}]} active={tab} onChange={setTab}/>

      {tab==="list"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",gap:8}}>
            <Sel value={fStatus} onChange={setFStatus} style={{width:140}}>
              <option value="All">All Status</option>
              {PR_STATUSES.map(s=><option key={s}>{s}</option>)}
            </Sel>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {filtPRs.length===0&&<div style={{color:P.muted,fontSize:12,textAlign:"center",padding:24,background:P.surf2,borderRadius:10}}>No purchase requisitions. Click + New PR to raise one.</div>}
            {filtPRs.map(pr=>{
              const vendor=vendors.find(v=>v.id===pr.vendorId);
              const entity=entities.find(e=>e.id===pr.entityId);
              return(
                <Card key={pr.id} accent={statusClr[pr.status]}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:10}}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{color:P.gold,fontFamily:"monospace",fontWeight:700,fontSize:12}}>{pr.prNumber}</span>
                        <Badge label={pr.status} color={statusClr[pr.status]}/>
                        {entity&&<div style={{display:"flex",alignItems:"center",gap:5}}><EntityDot entity={entity} size={6}/><span style={{color:entity.color,fontSize:10}}>{entity.name}</span></div>}
                      </div>
                      <div style={{color:P.text,fontSize:12,fontWeight:600,marginBottom:2}}>{vendor?.name||"No vendor selected"}</div>
                      <div style={{color:P.muted,fontSize:10}}>{pr.requestor} · {pr.department} · Required by {pr.requiredDate}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{color:P.gold,fontFamily:"monospace",fontSize:16,fontWeight:800}}>{fmtAmt(pr.estimatedTotal,pr.currency)}</div>
                      <div style={{color:P.muted,fontSize:9,marginTop:2}}>{pr.items.length} line item{pr.items.length!==1?"s":""}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {pr.status==="Draft"&&<Btn onClick={()=>submit(pr.id)} small color={P.blue}>Submit for Approval</Btn>}
                    {pr.status==="Submitted"&&<><Btn onClick={()=>approve(pr.id)} small color={P.green}>✓ Approve</Btn><Btn onClick={()=>reject(pr.id)} small outline danger>✗ Reject</Btn></>}
                    {pr.status==="Approved"&&!pr.poId&&<Btn onClick={()=>convertToPO(pr)} small color={P.purple}>Convert to PO →</Btn>}
                    {pr.poId&&<span style={{color:P.purple,fontSize:11}}>→ {purchaseOrders.find(p=>p.id===pr.poId)?.poNumber||pr.poId}</span>}
                    {pr.status==="Draft"&&<Btn onClick={()=>{setForm({...pr,items:pr.items.map(i=>({...i,unitCost:String(i.unitCost)}))});setEditing(pr.id);setTab("add");}} small outline color={P.gold}>Edit</Btn>}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {tab==="add"&&(
        <Card title={editing?"Edit Purchase Requisition":"New Purchase Requisition"} accent={editing?P.gold:P.green}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>ENTITY *</div><Sel value={form.entityId} onChange={v=>setForm(f=>({...f,entityId:v}))} style={{width:"100%"}}>{activeE.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>VENDOR</div><Sel value={form.vendorId} onChange={v=>setForm(f=>({...f,vendorId:v,currency:vendors.find(x=>x.id===v)?.currency||"MYR"}))} style={{width:"100%"}}><option value="">Select vendor</option>{activeVendors.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>REQUESTOR *</div><Input value={form.requestor} onChange={v=>setForm(f=>({...f,requestor:v}))} placeholder="Your name"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>DEPARTMENT</div><Input value={form.department} onChange={v=>setForm(f=>({...f,department:v}))} placeholder="Department"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>COST CENTRE</div><Input value={form.costCentre} onChange={v=>setForm(f=>({...f,costCentre:v}))} placeholder="Cost centre"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>REQUIRED DATE</div><Input value={form.requiredDate} onChange={v=>setForm(f=>({...f,requiredDate:v}))} type="date"/></div>
          </div>
          {/* Line items */}
          <div style={{marginBottom:14}}>
            <div style={{color:P.muted,fontSize:9,fontWeight:700,letterSpacing:1.5,marginBottom:8}}>LINE ITEMS</div>
            {form.items.map((item,idx)=>(
              <div key={idx} style={{display:"grid",gridTemplateColumns:"1fr 80px 100px 80px auto",gap:8,marginBottom:6,alignItems:"end"}}>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>{idx===0?"DESCRIPTION *":""}</div><Input value={item.description} onChange={v=>updateItem(idx,"description",v)} placeholder="Item description"/></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>{idx===0?"QTY":""}</div><Input value={item.qty} onChange={v=>updateItem(idx,"qty",v)} type="number" placeholder="1"/></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>{idx===0?"UNIT COST":""}</div><Input value={item.unitCost} onChange={v=>updateItem(idx,"unitCost",v)} type="number" placeholder="0"/></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>{idx===0?"UNIT":""}</div><Input value={item.unit} onChange={v=>updateItem(idx,"unit",v)} placeholder="unit"/></div>
                <div style={{paddingTop:idx===0?16:0}}>{form.items.length>1&&<Btn onClick={()=>removeItem(idx)} small outline danger>✕</Btn>}</div>
              </div>
            ))}
            <Btn onClick={addItem} small outline color={P.blue}>+ Add Line</Btn>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,padding:"10px 14px",background:P.surf2,borderRadius:9}}>
            <span style={{color:P.muted,fontSize:12}}>Estimated Total</span>
            <span style={{color:P.gold,fontFamily:"monospace",fontSize:16,fontWeight:800}}>{fmtAmt(calcTotal(form.items),form.currency)}</span>
          </div>
          <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>NOTES</div><Input value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))} placeholder="Additional notes or justification"/></div>
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <Btn onClick={()=>save("Draft")} outline color={P.muted}>Save as Draft</Btn>
            <Btn onClick={()=>save("Submitted")} color={P.blue}>Submit for Approval</Btn>
            {editing&&<Btn onClick={()=>{setForm({...BLANK_PR});setEditing(null);setTab("list");}} outline color={P.red}>Cancel</Btn>}
          </div>
        </Card>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MODULE P3: PURCHASE ORDER (PO)
// ══════════════════════════════════════════════════════════════════
function POModule({gf}){
  const {store,setStore}=useStore();
  const {purchaseOrders=[],goodsReceipts=[],vendors=[],entities,fxRates}=store;
  const [tab,setTab]=useState("list");
  const [fStatus,setFStatus]=useState("All");
  const activeE=entities.filter(e=>e.active&&gf.entityIds.includes(e.id));
  const activeVendors=vendors.filter(v=>v.status==="Active");
  const spotRow=fxRates[fxRates.length-1]||{};
  function toRM(amt,ccy){if(ccy===BASE)return amt;if(ccy==="USD")return amt*(spotRow.MYR||4.5);const r=spotRow[ccy],m=spotRow.MYR;return(r&&m)?amt*(m/r):amt;}

  const filtPOs=purchaseOrders.filter(p=>gf.entityIds.includes(p.entityId)&&(fStatus==="All"||p.status===fStatus));

  const BLANK_PO={vendorId:"",entityId:activeE[0]?.id||"",items:[{description:"",qty:1,unitPrice:"",unit:"unit",glAccount:"5400"}],currency:"MYR",deliveryDate:"",terms:"Net 30",notes:""};
  const [form,setForm]=useState({...BLANK_PO});
  const [editing,setEditing]=useState(null);

  function calcTotal(items){return items.reduce((s,i)=>s+(parseFloat(i.qty)||0)*(parseFloat(i.unitPrice)||0),0);}
  function addItem(){setForm(f=>({...f,items:[...f.items,{description:"",qty:1,unitPrice:"",unit:"unit",glAccount:"5400"}]}));}
  function removeItem(idx){setForm(f=>({...f,items:f.items.filter((_,i)=>i!==idx)}));}
  function updateItem(idx,field,val){setForm(f=>({...f,items:f.items.map((it,i)=>i===idx?{...it,[field]:val}:it)}));}

  function save(){
    if(!form.vendorId||!form.entityId||!form.items[0].description) return;
    const total=calcTotal(form.items);
    const po={...form,id:form.id||autoId("PO"),prId:form.prId||"",poNumber:form.poNumber||"PO-"+new Date().getFullYear()+"-"+String(purchaseOrders.length+1).padStart(3,"0"),total,issuedDate:form.issuedDate||new Date().toISOString().slice(0,10),status:form.status||"Issued",items:form.items.map(i=>({...i,unitPrice:parseFloat(i.unitPrice)||0,qty:parseFloat(i.qty)||1}))};
    const updated=editing?purchaseOrders.map(p=>p.id===editing?po:p):[...purchaseOrders,po];
    const ns={...store,purchaseOrders:updated};setStore(ns);persist(ns);
    setForm({...BLANK_PO});setEditing(null);setTab("list");
  }

  function updateStatus(id,status){const ns={...store,purchaseOrders:purchaseOrders.map(p=>p.id===id?{...p,status}:p)};setStore(ns);persist(ns);}
  function startEdit(po){setForm({...po,items:po.items.map(i=>({...i,unitPrice:String(i.unitPrice)}))});setEditing(po.id);setTab("add");}

  const statusClr={Draft:P.muted,Issued:P.blue,"Partially Received":P.orange,"Fully Received":P.green,Closed:P.purple,Cancelled:P.red};

  // Summary metrics
  const totalPOValue=filtPOs.filter(p=>!["Cancelled"].includes(p.status)).reduce((s,p)=>s+toRM(p.total,p.currency),0);
  const openPOs=filtPOs.filter(p=>["Issued","Partially Received"].includes(p.status)).length;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        <KPI label="Total PO Value"  value={fmtK(totalPOValue)} color={P.blue}   accent={P.blue}   small/>
        <KPI label="Open POs"        value={openPOs}            color={P.orange} accent={P.orange} small sub="Issued + Partial"/>
        <KPI label="Total POs"       value={filtPOs.length}     color={P.sub}    small/>
        {PO_STATUSES.slice(0,4).map(s=>{const c=filtPOs.filter(p=>p.status===s).length;return c>0?<KPI key={s} label={s} value={c} color={statusClr[s]} small/>:null;})}
      </div>

      <SubTabs tabs={[{id:"list",label:"PO List"},{id:"add",label:editing?"Edit PO":"+ New PO"}]} active={tab} onChange={setTab}/>

      {tab==="list"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",gap:8}}>
            <Sel value={fStatus} onChange={setFStatus} style={{width:160}}>
              <option value="All">All Status</option>
              {PO_STATUSES.map(s=><option key={s}>{s}</option>)}
            </Sel>
          </div>
          {filtPOs.length===0&&<div style={{color:P.muted,fontSize:12,textAlign:"center",padding:24,background:P.surf2,borderRadius:10}}>No purchase orders. Create from an approved PR or manually via + New PO.</div>}
          {filtPOs.map(po=>{
            const vendor=vendors.find(v=>v.id===po.vendorId);
            const entity=entities.find(e=>e.id===po.entityId);
            const grList=goodsReceipts.filter(g=>g.poId===po.id);
            return(
              <Card key={po.id} accent={statusClr[po.status]}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:10}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <span style={{color:P.gold,fontFamily:"monospace",fontWeight:700,fontSize:12}}>{po.poNumber}</span>
                      <Badge label={po.status} color={statusClr[po.status]}/>
                      {entity&&<div style={{display:"flex",alignItems:"center",gap:5}}><EntityDot entity={entity} size={6}/><span style={{color:entity.color,fontSize:10}}>{entity.name}</span></div>}
                    </div>
                    <div style={{color:P.text,fontSize:12,fontWeight:600,marginBottom:2}}>{vendor?.name||"Unknown vendor"}</div>
                    <div style={{color:P.muted,fontSize:10}}>Issued {po.issuedDate} · Delivery {po.deliveryDate} · {po.terms}</div>
                    {grList.length>0&&<div style={{color:P.green,fontSize:10,marginTop:2}}>✓ {grList.length} GR{grList.length!==1?"s":""} received</div>}
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{color:P.gold,fontFamily:"monospace",fontSize:16,fontWeight:800}}>{fmtAmt(po.total,po.currency)}</div>
                    <div style={{color:P.muted,fontSize:9,marginTop:2}}>{po.items.length} line{po.items.length!==1?"s":""}</div>
                    <div style={{color:P.sub,fontSize:10}}>{fmtK(toRM(po.total,po.currency))} MYR</div>
                  </div>
                </div>
                {/* Line items preview */}
                <div style={{marginBottom:10}}>
                  {po.items.map((item,i)=>(
                    <div key={i} style={{display:"flex",gap:10,fontSize:10,color:P.muted,padding:"3px 0"}}>
                      <span style={{flex:1,color:P.sub}}>{item.description}</span>
                      <span>{item.qty} {item.unit}</span>
                      <span style={{fontFamily:"monospace"}}>{fmtAmt(item.unitPrice,po.currency)}</span>
                      <span style={{color:P.muted}}>→ {item.glAccount}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {["Issued","Partially Received"].includes(po.status)&&<Btn onClick={()=>updateStatus(po.id,"Fully Received")} small color={P.green}>Mark Received</Btn>}
                  {po.status==="Issued"&&<Btn onClick={()=>updateStatus(po.id,"Cancelled")} small outline danger>Cancel</Btn>}
                  {po.status==="Fully Received"&&<Btn onClick={()=>updateStatus(po.id,"Closed")} small outline color={P.purple}>Close PO</Btn>}
                  {["Draft","Issued"].includes(po.status)&&<Btn onClick={()=>startEdit(po)} small outline color={P.gold}>Edit</Btn>}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {tab==="add"&&(
        <Card title={editing?"Edit Purchase Order":"New Purchase Order"} accent={editing?P.gold:P.green}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>VENDOR *</div><Sel value={form.vendorId} onChange={v=>setForm(f=>({...f,vendorId:v,currency:vendors.find(x=>x.id===v)?.currency||"MYR",terms:vendors.find(x=>x.id===v)?.paymentTerms||"Net 30"}))} style={{width:"100%"}}><option value="">Select vendor</option>{activeVendors.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>ENTITY *</div><Sel value={form.entityId} onChange={v=>setForm(f=>({...f,entityId:v}))} style={{width:"100%"}}>{activeE.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>CURRENCY</div><Sel value={form.currency} onChange={v=>setForm(f=>({...f,currency:v}))} style={{width:"100%"}}>{CCY_LIST.map(c=><option key={c}>{c}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>DELIVERY DATE</div><Input value={form.deliveryDate} onChange={v=>setForm(f=>({...f,deliveryDate:v}))} type="date"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>PAYMENT TERMS</div><Sel value={form.terms} onChange={v=>setForm(f=>({...f,terms:v}))} style={{width:"100%"}}>{PAYMENT_TERMS.map(t=><option key={t}>{t}</option>)}</Sel></div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{color:P.muted,fontSize:9,fontWeight:700,letterSpacing:1.5,marginBottom:8}}>LINE ITEMS</div>
            {form.items.map((item,idx)=>(
              <div key={idx} style={{display:"grid",gridTemplateColumns:"1fr 70px 100px 70px 90px auto",gap:8,marginBottom:6,alignItems:"end"}}>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>{idx===0?"DESCRIPTION *":""}</div><Input value={item.description} onChange={v=>updateItem(idx,"description",v)} placeholder="Description"/></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>{idx===0?"QTY":""}</div><Input value={item.qty} onChange={v=>updateItem(idx,"qty",v)} type="number"/></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>{idx===0?"UNIT PRICE":""}</div><Input value={item.unitPrice} onChange={v=>updateItem(idx,"unitPrice",v)} type="number"/></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>{idx===0?"UNIT":""}</div><Input value={item.unit} onChange={v=>updateItem(idx,"unit",v)} placeholder="unit"/></div>
                <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>{idx===0?"GL ACCOUNT":""}</div><Input value={item.glAccount} onChange={v=>updateItem(idx,"glAccount",v)} placeholder="5400"/></div>
                <div style={{paddingTop:idx===0?16:0}}>{form.items.length>1&&<Btn onClick={()=>removeItem(idx)} small outline danger>✕</Btn>}</div>
              </div>
            ))}
            <Btn onClick={addItem} small outline color={P.blue}>+ Add Line</Btn>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,padding:"10px 14px",background:P.surf2,borderRadius:9}}>
            <span style={{color:P.muted,fontSize:12}}>PO Total</span>
            <span style={{color:P.gold,fontFamily:"monospace",fontSize:16,fontWeight:800}}>{fmtAmt(calcTotal(form.items),form.currency)}</span>
          </div>
          <Input value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))} placeholder="Notes"/>
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <Btn onClick={save} color={P.gold} disabled={!form.vendorId||!form.items[0].description}>{editing?"Save Changes":"Issue PO"}</Btn>
            {editing&&<Btn onClick={()=>{setForm({...BLANK_PO});setEditing(null);setTab("list");}} outline color={P.muted}>Cancel</Btn>}
          </div>
        </Card>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MODULE P4: GOODS RECEIPT / SERVICE CONFIRMATION (GR)
// ══════════════════════════════════════════════════════════════════
function GRModule({gf,prefill,clearPrefill}){
  const {store,setStore}=useStore();
  const {goodsReceipts=[],purchaseOrders=[],vendors=[],entities,fxRates}=store;
  const [tab,setTab]=useState("list");
  const activeE=entities.filter(e=>e.active&&gf.entityIds.includes(e.id));

  // Open POs available for GR
  const openPOs=purchaseOrders.filter(p=>gf.entityIds.includes(p.entityId)&&["Issued","Partially Received"].includes(p.status));

  const [form,setForm]=useState({poId:"",receivedBy:"",receivedDate:new Date().toISOString().slice(0,10),notes:"",items:[]});
  const [editing,setEditing]=useState(null);

  function selectPO(poId){
    const po=purchaseOrders.find(p=>p.id===poId);
    if(!po) return;
    setForm(f=>({...f,poId,entityId:po.entityId,vendorId:po.vendorId,items:po.items.map(i=>({description:i.description,qtyOrdered:i.qty,qtyReceived:i.qty,unit:i.unit}))}));
  }

  function updateQty(idx,val){setForm(f=>({...f,items:f.items.map((it,i)=>i===idx?{...it,qtyReceived:parseFloat(val)||0}:it)}));}

  function save(){
    if(!form.poId||!form.receivedBy) return;
    const allFull=form.items.every(i=>i.qtyReceived>=i.qtyOrdered);
    const status=allFull?"Complete":"Partial";
    const gr={...form,id:autoId("GR"),grNumber:"GR-"+new Date().getFullYear()+"-"+String(goodsReceipts.length+1).padStart(3,"0"),status};
    const newGRs=[...goodsReceipts,gr];
    const newPOs=purchaseOrders.map(p=>p.id===form.poId?{...p,status:allFull?"Fully Received":"Partially Received"}:p);
    const ns={...store,goodsReceipts:newGRs,purchaseOrders:newPOs};setStore(ns);persist(ns);
    setForm({poId:"",receivedBy:"",receivedDate:new Date().toISOString().slice(0,10),notes:"",items:[]});setTab("list");
  }

  const filtGRs=goodsReceipts.filter(g=>gf.entityIds.includes(g.entityId));
  const statusClr={Complete:P.green,Partial:P.orange};

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        <KPI label="Total GRs"  value={filtGRs.length}                                    color={P.blue}   small/>
        <KPI label="Complete"   value={filtGRs.filter(g=>g.status==="Complete").length}   color={P.green}  small/>
        <KPI label="Partial"    value={filtGRs.filter(g=>g.status==="Partial").length}    color={P.orange} small/>
        <KPI label="Open POs"   value={openPOs.length}                                    color={P.gold}   small sub="awaiting receipt"/>
      </div>

      <SubTabs tabs={[{id:"list",label:"GR List"},{id:"add",label:"+ Record Receipt"}]} active={tab} onChange={setTab}/>

      {tab==="list"&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {filtGRs.length===0&&<div style={{color:P.muted,fontSize:12,textAlign:"center",padding:24,background:P.surf2,borderRadius:10}}>No goods receipts recorded. Use + Record Receipt when goods or services are delivered.</div>}
          {filtGRs.map(gr=>{
            const po=purchaseOrders.find(p=>p.id===gr.poId);
            const vendor=vendors.find(v=>v.id===gr.vendorId);
            const entity=entities.find(e=>e.id===gr.entityId);
            return(
              <Card key={gr.id} accent={statusClr[gr.status]}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:8}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <span style={{color:P.gold,fontFamily:"monospace",fontWeight:700,fontSize:12}}>{gr.grNumber}</span>
                      <Badge label={gr.status} color={statusClr[gr.status]}/>
                      {entity&&<div style={{display:"flex",alignItems:"center",gap:5}}><EntityDot entity={entity} size={6}/><span style={{color:entity.color,fontSize:10}}>{entity.name}</span></div>}
                    </div>
                    <div style={{color:P.text,fontSize:12,fontWeight:600,marginBottom:2}}>{vendor?.name||"Unknown"} → {po?.poNumber||gr.poId}</div>
                    <div style={{color:P.muted,fontSize:10}}>Received {gr.receivedDate} by {gr.receivedBy}</div>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:3}}>
                  {gr.items.map((item,i)=>(
                    <div key={i} style={{display:"flex",gap:10,fontSize:10,color:P.muted,padding:"3px 0",borderBottom:`1px solid ${P.border}20`}}>
                      <span style={{flex:1,color:P.sub}}>{item.description}</span>
                      <span style={{color:item.qtyReceived>=item.qtyOrdered?P.green:P.orange}}>Rcvd: {item.qtyReceived}/{item.qtyOrdered} {item.unit}</span>
                    </div>
                  ))}
                </div>
                {gr.notes&&<div style={{color:P.muted,fontSize:10,marginTop:6,fontStyle:"italic"}}>{gr.notes}</div>}
              </Card>
            );
          })}
        </div>
      )}

      {tab==="add"&&(
        <Card title="Record Goods / Service Receipt" accent={P.green}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
            <div style={{gridColumn:"span 2"}}>
              <div style={{color:P.muted,fontSize:9,marginBottom:3}}>PURCHASE ORDER *</div>
              <Sel value={form.poId} onChange={selectPO} style={{width:"100%"}}>
                <option value="">Select open PO</option>
                {openPOs.map(po=>{const v=vendors.find(x=>x.id===po.vendorId);return<option key={po.id} value={po.id}>{po.poNumber} — {v?.name||"Unknown"} ({po.currency} {po.total.toLocaleString()})</option>;})}
              </Sel>
              {openPOs.length===0&&<div style={{color:P.orange,fontSize:10,marginTop:4}}>No open POs available. Issue a PO first.</div>}
            </div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>DATE RECEIVED</div><Input value={form.receivedDate} onChange={v=>setForm(f=>({...f,receivedDate:v}))} type="date"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>RECEIVED BY *</div><Input value={form.receivedBy} onChange={v=>setForm(f=>({...f,receivedBy:v}))} placeholder="Your name"/></div>
          </div>
          {form.items.length>0&&(
            <div style={{marginBottom:14}}>
              <div style={{color:P.muted,fontSize:9,fontWeight:700,letterSpacing:1.5,marginBottom:8}}>QUANTITIES RECEIVED</div>
              {form.items.map((item,idx)=>(
                <div key={idx} style={{display:"flex",gap:12,alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${P.border}20`}}>
                  <span style={{flex:1,color:P.sub,fontSize:12}}>{item.description}</span>
                  <span style={{color:P.muted,fontSize:10}}>Ordered: {item.qtyOrdered} {item.unit}</span>
                  <div style={{width:100}}>
                    <Input value={item.qtyReceived} onChange={v=>updateQty(idx,v)} type="number" style={{textAlign:"right"}}/>
                  </div>
                  <span style={{color:item.qtyReceived>=item.qtyOrdered?P.green:P.orange,fontSize:10,width:60}}>
                    {item.qtyReceived>=item.qtyOrdered?"✓ Full":"Partial"}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Input value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))} placeholder="Condition notes, partial delivery reason…"/>
          <div style={{marginTop:14}}><Btn onClick={save} color={P.green} disabled={!form.poId||!form.receivedBy}>Confirm Receipt</Btn></div>
        </Card>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MODULE P5: SUPPLIER INVOICE + 3-WAY MATCH
// ══════════════════════════════════════════════════════════════════
function SupplierInvoiceModule({gf,prefill,clearPrefill}){
  const {store,setStore}=useStore();
  const {supplierInvoices=[],purchaseOrders=[],goodsReceipts=[],vendors=[],entities,fxRates,ar,ap}=store;
  const [tab,setTab]=useState("list");
  const [fStatus,setFStatus]=useState("All");
  const activeE=entities.filter(e=>e.active&&gf.entityIds.includes(e.id));
  const activeVendors=vendors.filter(v=>v.status==="Active");
  const spotRow=fxRates[fxRates.length-1]||{};
  function toRM(amt,ccy){if(ccy===BASE)return amt;if(ccy==="USD")return amt*(spotRow.MYR||4.5);const r=spotRow[ccy],m=spotRow.MYR;return(r&&m)?amt*(m/r):amt;}

  const filtInv=supplierInvoices.filter(i=>gf.entityIds.includes(i.entityId)&&(fStatus==="All"||i.status===fStatus||i.matchStatus===fStatus));

  const BLANK_INV={vendorId:"",entityId:activeE[0]?.id||"",invoiceNumber:"",invoiceDate:"",dueDate:"",poId:"",grId:"",currency:"MYR",amount:"",lineItems:[{description:"",qty:1,unitPrice:"",glAccount:"5400"}],notes:""};
  const [form,setForm]=useState({...BLANK_INV});
  const [captureConf,setCaptureConf]=useState(null);
  // Apply capture prefill (from FAB global capture or module CaptureButton)
  const prevPrefill=useRef(null);
  if(prefill&&prefill!==prevPrefill.current){
    prevPrefill.current=prefill;
    const v=activeVendors.find(v2=>v2.name?.toLowerCase()===prefill.vendorName?.toLowerCase());
    setTimeout(()=>{
      setForm(f=>({...f,
        vendorId:v?.id||f.vendorId,
        invoiceNumber:prefill.invoiceNo||f.invoiceNumber,
        invoiceDate:prefill.invoiceDate||f.invoiceDate,
        dueDate:prefill.dueDate||f.dueDate,
        currency:prefill.currency||f.currency,
        amount:prefill.total||f.amount,
        lineItems:prefill.lineItems?.length?prefill.lineItems.map(li=>({description:li.description||"",qty:parseFloat(li.qty)||1,unitPrice:parseFloat((li.unitPrice||"").replace(/[^0-9.]/g,""))||0,glAccount:"5400"})):[{description:"",qty:1,unitPrice:"",glAccount:"5400"}],
        notes:prefill.poReference?"PO Ref: "+prefill.poReference:"",
      }));
      setCaptureConf(prefill._confidence||null);
      clearPrefill?.();
      setTab("new");
    },0);
  }
  const TOLERANCE=0.02; // 2% price variance tolerance

  function run3WayMatch(inv){
    const po=purchaseOrders.find(p=>p.id===inv.poId);
    const gr=goodsReceipts.find(g=>g.id===inv.grId);
    if(!po) return{matchStatus:"No PO",matchNotes:"No PO reference — invoice cannot be matched"};
    if(!gr) return{matchStatus:"Pending",matchNotes:"Awaiting goods receipt confirmation"};
    // Price check
    const poDiff=Math.abs(inv.amount-po.total)/po.total;
    if(poDiff>TOLERANCE) return{matchStatus:"Price Variance",matchNotes:"Invoice "+fmtAmt(inv.amount,inv.currency)+" vs PO "+fmtAmt(po.total,inv.currency)+" — "+( poDiff*100).toFixed(1)+"% variance (tolerance "+TOLERANCE*100+"%)"};
    // GR check — all items received
    const allReceived=gr.status==="Complete";
    if(!allReceived) return{matchStatus:"Qty Variance",matchNotes:"GR "+gr.grNumber+" shows partial receipt — confirm full delivery before approving"};
    return{matchStatus:"Matched",matchNotes:"✓ PO amount, GR status all confirmed"};
  }

  function saveInvoice(){
    if(!form.vendorId||!form.invoiceNumber||!form.amount) return;
    const inv={...form,id:autoId("INV"),amount:parseFloat(form.amount),lineItems:form.lineItems.map(i=>({...i,unitPrice:parseFloat(i.unitPrice)||0})),approvedBy:"",approvedAt:"",apRecordId:"",status:"Pending"};
    const match=run3WayMatch(inv);
    const newInv={...inv,...match};
    const updated=[...supplierInvoices,newInv];
    const ns={...store,supplierInvoices:updated};setStore(ns);persist(ns);
    setForm({...BLANK_INV});setTab("list");
  }

  function approveInvoice(id){
    const inv=supplierInvoices.find(i=>i.id===id);
    if(!inv) return;
    // Create AP record
    const dueDate=inv.dueDate||new Date(Date.now()+30*86400000).toISOString().slice(0,10);
    const apRecord={id:"AP-"+autoId(""),entityId:inv.entityId,counterparty:vendors.find(v=>v.id===inv.vendorId)?.name||"Unknown",invoiceDate:inv.invoiceDate,dueDate,currency:inv.currency,amount:inv.amount,status:"Outstanding",notes:"From invoice "+inv.invoiceNumber};
    const newAP=[...(store.ap||[]),apRecord];
    const updatedInv=supplierInvoices.map(i=>i.id===id?{...i,status:"Approved",approvedBy:"Finance",approvedAt:new Date().toISOString().slice(0,10),apRecordId:apRecord.id}:i);
    const ns={...store,supplierInvoices:updatedInv,ap:newAP};setStore(ns);persist(ns);
  }

  function rejectInvoice(id){const ns={...store,supplierInvoices:supplierInvoices.map(i=>i.id===id?{...i,status:"Rejected"}:i)};setStore(ns);persist(ns);}

  function rerunMatch(id){
    const inv=supplierInvoices.find(i=>i.id===id);
    if(!inv) return;
    const match=run3WayMatch(inv);
    const ns={...store,supplierInvoices:supplierInvoices.map(i=>i.id===id?{...i,...match}:i)};setStore(ns);persist(ns);
  }

  const matchClr={Matched:P.green,"Price Variance":P.orange,"Qty Variance":P.orange,"No PO":P.red,Pending:P.muted};
  const pendingCount=filtInv.filter(i=>i.status==="Pending").length;
  const matchedCount=filtInv.filter(i=>i.matchStatus==="Matched").length;
  const varianceCount=filtInv.filter(i=>["Price Variance","Qty Variance"].includes(i.matchStatus)).length;
  const totalPendingMYR=filtInv.filter(i=>i.status==="Pending").reduce((s,i)=>s+toRM(i.amount,i.currency),0);

  function updateItem(idx,field,val){setForm(f=>({...f,lineItems:f.lineItems.map((it,i)=>i===idx?{...it,[field]:val}:it)}));}

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        <KPI label="Pending Approval" value={pendingCount}         color={P.orange} accent={P.orange} small sub={fmtK(totalPendingMYR)+" MYR"}/>
        <KPI label="Matched"          value={matchedCount}         color={P.green}  accent={P.green}  small/>
        <KPI label="Variances"        value={varianceCount}        color={P.red}    accent={P.red}    small sub="need review"/>
        <KPI label="Total Invoices"   value={filtInv.length}       color={P.sub}    small/>
      </div>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <SubTabs tabs={[{id:"list",label:"Invoice List"},{id:"new",label:"+ New Invoice"}]} active={tab} onChange={setTab}/>
        <CaptureButton module="supplier_invoice" label="📸 Capture Invoice"
          onComplete={({payload})=>{
            const v=activeVendors.find(v2=>v2.name?.toLowerCase()===payload.vendorName?.toLowerCase());
            setForm(f=>({...f,vendorId:v?.id||f.vendorId,invoiceNumber:payload.invoiceNo||f.invoiceNumber,invoiceDate:payload.invoiceDate||f.invoiceDate,dueDate:payload.dueDate||f.dueDate,currency:payload.currency||f.currency,amount:payload.total||f.amount,lineItems:payload.lineItems?.length?payload.lineItems.map(li=>({description:li.description||"",qty:parseFloat(li.qty)||1,unitPrice:parseFloat((li.unitPrice||"").replace(/[^0-9.]/g,""))||0,glAccount:"5400"})):[{description:"",qty:1,unitPrice:"",glAccount:"5400"}],notes:payload.poReference?"PO Ref: "+payload.poReference:""}));
            setCaptureConf(payload._confidence||null);setTab("new");}}/>
      </div>

      {tab==="list"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <Sel value={fStatus} onChange={setFStatus} style={{width:160}}>
            <option value="All">All</option>
            {["Pending","Matched","Price Variance","Qty Variance","No PO","Approved","Rejected"].map(s=><option key={s}>{s}</option>)}
          </Sel>
          {filtInv.length===0&&<div style={{color:P.muted,fontSize:12,textAlign:"center",padding:24,background:P.surf2,borderRadius:10}}>No invoices. Enter supplier invoices for 3-way matching.</div>}
          {filtInv.map(inv=>{
            const vendor=vendors.find(v=>v.id===inv.vendorId);
            const entity=entities.find(e=>e.id===inv.entityId);
            const po=purchaseOrders.find(p=>p.id===inv.poId);
            return(
              <Card key={inv.id} accent={matchClr[inv.matchStatus]||P.border}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:10}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                      <span style={{color:P.gold,fontFamily:"monospace",fontWeight:700,fontSize:12}}>{inv.invoiceNumber}</span>
                      <Badge label={inv.matchStatus} color={matchClr[inv.matchStatus]||P.muted}/>
                      <Badge label={inv.status} color={inv.status==="Approved"?P.blue:inv.status==="Rejected"?P.red:P.muted}/>
                      {entity&&<div style={{display:"flex",alignItems:"center",gap:5}}><EntityDot entity={entity} size={6}/><span style={{color:entity.color,fontSize:10}}>{entity.name}</span></div>}
                    </div>
                    <div style={{color:P.text,fontSize:12,fontWeight:600,marginBottom:2}}>{vendor?.name||"Unknown vendor"}</div>
                    <div style={{color:P.muted,fontSize:10}}>Inv date: {inv.invoiceDate} · Due: {inv.dueDate}</div>
                    {po&&<div style={{color:P.muted,fontSize:10}}>PO: {po.poNumber}</div>}
                    {inv.matchNotes&&<div style={{color:matchClr[inv.matchStatus]||P.muted,fontSize:10,marginTop:4,fontStyle:"italic"}}>{inv.matchNotes}</div>}
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{color:P.gold,fontFamily:"monospace",fontSize:16,fontWeight:800}}>{fmtAmt(inv.amount,inv.currency)}</div>
                    <div style={{color:P.sub,fontSize:10}}>{fmtK(toRM(inv.amount,inv.currency))} MYR</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {inv.status==="Pending"&&inv.matchStatus==="Matched"&&<Btn onClick={()=>approveInvoice(inv.id)} small color={P.green}>✓ Approve → Create AP</Btn>}
                  {inv.status==="Pending"&&<Btn onClick={()=>rejectInvoice(inv.id)} small outline danger>✗ Reject</Btn>}
                  {inv.status==="Pending"&&<Btn onClick={()=>rerunMatch(inv.id)} small outline color={P.blue}>Re-run Match</Btn>}
                  {inv.status==="Approved"&&inv.apRecordId&&<span style={{color:P.green,fontSize:10}}>✓ AP record created</span>}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {tab==="new"&&(
        <Card title="Add Supplier Invoice" accent={P.green}>
              {captureConf!=null&&<div style={{display:"inline-flex",alignItems:"center",gap:6,background:captureConf>=90?"#ECFDF5":captureConf>=70?"#FFFBEB":"#FEF2F2",border:`1px solid ${captureConf>=90?"#6EE7B7":captureConf>=70?"#FCD34D":"#FCA5A5"}`,borderRadius:99,padding:"3px 12px",fontSize:11,fontWeight:700,color:captureConf>=90?"#065F46":captureConf>=70?"#92400E":"#991B1B",marginBottom:6}}>📸 Captured at {captureConf}% confidence — verify fields before saving</div>}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>VENDOR *</div><Sel value={form.vendorId} onChange={v=>setForm(f=>({...f,vendorId:v,currency:vendors.find(x=>x.id===v)?.currency||"MYR"}))} style={{width:"100%"}}><option value="">Select vendor</option>{activeVendors.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>ENTITY *</div><Sel value={form.entityId} onChange={v=>setForm(f=>({...f,entityId:v}))} style={{width:"100%"}}>{activeE.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>INVOICE NUMBER *</div><Input value={form.invoiceNumber} onChange={v=>setForm(f=>({...f,invoiceNumber:v}))} placeholder="Supplier invoice no."/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>INVOICE DATE</div><Input value={form.invoiceDate} onChange={v=>setForm(f=>({...f,invoiceDate:v}))} type="date"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>DUE DATE</div><Input value={form.dueDate} onChange={v=>setForm(f=>({...f,dueDate:v}))} type="date"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>INVOICE AMOUNT *</div><Input value={form.amount} onChange={v=>setForm(f=>({...f,amount:v}))} type="number" placeholder="0"/></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>CURRENCY</div><Sel value={form.currency} onChange={v=>setForm(f=>({...f,currency:v}))} style={{width:"100%"}}>{CCY_LIST.map(c=><option key={c}>{c}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>LINKED PO (for 3-way match)</div><Sel value={form.poId} onChange={v=>setForm(f=>({...f,poId:v}))} style={{width:"100%"}}><option value="">None (no PO)</option>{purchaseOrders.filter(p=>gf.entityIds.includes(p.entityId)).map(p=><option key={p.id} value={p.id}>{p.poNumber}</option>)}</Sel></div>
            <div><div style={{color:P.muted,fontSize:9,marginBottom:3}}>LINKED GR (for 3-way match)</div><Sel value={form.grId} onChange={v=>setForm(f=>({...f,grId:v}))} style={{width:"100%"}}><option value="">None</option>{goodsReceipts.filter(g=>gf.entityIds.includes(g.entityId)).map(g=><option key={g.id} value={g.id}>{g.grNumber}</option>)}</Sel></div>
          </div>
          <div style={{background:`${P.blue}10`,border:`1px solid ${P.blue}30`,borderRadius:8,padding:"8px 12px",fontSize:10,color:P.blue,marginBottom:12}}>
            3-Way Match: Tolerance ±{TOLERANCE*100}%. System will auto-match Invoice vs PO amount vs GR status on save.
          </div>
          <Input value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))} placeholder="Notes"/>
          <div style={{marginTop:14}}><Btn onClick={saveInvoice} color={P.gold} disabled={!form.vendorId||!form.invoiceNumber||!form.amount}>Save & Run 3-Way Match</Btn></div>
        </Card>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MODULE P6: PAYMENT RUN
// ══════════════════════════════════════════════════════════════════
function PaymentRunModule({gf}){
  const {store,setStore}=useStore();
  const {paymentRuns=[],supplierInvoices=[],ap=[],vendors=[],entities,fxRates,gl,coa}=store;
  const [tab,setTab]=useState("runs");
  const [selected,setSelected]=useState(new Set());
  const activeE=entities.filter(e=>e.active&&gf.entityIds.includes(e.id));
  const spotRow=fxRates[fxRates.length-1]||{};
  function toRM(amt,ccy){if(ccy===BASE)return amt;if(ccy==="USD")return amt*(spotRow.MYR||4.5);const r=spotRow[ccy],m=spotRow.MYR;return(r&&m)?amt*(m/r):amt;}

  // Approved invoices not yet paid
  const payableInvoices=supplierInvoices.filter(i=>i.status==="Approved"&&gf.entityIds.includes(i.entityId)&&!paymentRuns.some(r=>r.payments.some(p=>p.invoiceId===i.id)&&r.status==="Processed"));

  function toggleSelect(id){setSelected(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});}
  function selectAll(){setSelected(new Set(payableInvoices.map(i=>i.id)));}
  function clearSel(){setSelected(new Set());}

  const selectedInvoices=payableInvoices.filter(i=>selected.has(i.id));
  const totalSelected=selectedInvoices.reduce((s,i)=>s+toRM(i.amount,i.currency),0);

  // Group by currency for payment advice
  const byCurrency={};
  selectedInvoices.forEach(i=>{
    if(!byCurrency[i.currency])byCurrency[i.currency]=[];
    byCurrency[i.currency].push(i);
  });

  function createRun(){
    if(!selectedInvoices.length) return;
    const entity=activeE[0];
    const run={
      id:autoId("PAY"),entityId:entity?.id||"",runDate:new Date().toISOString().slice(0,10),
      currency:"MYR",batchRef:"PAY-"+new Date().toISOString().slice(0,7).replace("-","").slice(2)+"-"+String(paymentRuns.length+1).padStart(3,"0"),
      payments:selectedInvoices.map(i=>({invoiceId:i.id,vendorId:i.vendorId,amount:i.amount,currency:i.currency,amountMYR:toRM(i.amount,i.currency)})),
      totalAmount:totalSelected,status:"Draft",processedBy:"",processedAt:"",glJournalId:"",
    };
    const ns={...store,paymentRuns:[...paymentRuns,run]};setStore(ns);persist(ns);
    setSelected(new Set());setTab("runs");
  }

  function processRun(runId){
    const run=paymentRuns.find(r=>r.id===runId);
    if(!run) return;
    // Mark AP records as Paid
    const paidInvoiceIds=new Set(run.payments.map(p=>p.invoiceId));
    const newAP=ap.map(a=>{
      const inv=supplierInvoices.find(i=>paidInvoiceIds.has(i.id)&&i.apRecordId===a.id);
      return inv?{...a,status:"Paid"}:a;
    });
    // Post GL journal Dr AP / Cr Cash
    const glEntry={id:autoId("JE"),entityId:run.entityId,period:isoToMonLabel(run.runDate)||"",date:run.runDate,ref:run.batchRef,description:"Payment run "+run.batchRef,drAccount:"2000",crAccount:"1000",currency:"MYR",amount:run.totalAmount,icEntityId:null};
    const newGL=[...(store.gl||[]),glEntry];
    const updatedRuns=paymentRuns.map(r=>r.id===runId?{...r,status:"Processed",processedBy:"Finance",processedAt:new Date().toISOString().slice(0,10),glJournalId:glEntry.id}:r);
    const ns={...store,paymentRuns:updatedRuns,ap:newAP,gl:newGL};setStore(ns);persist(ns);
  }

  function downloadAdvice(run){
    const lines=run.payments.map(p=>{
      const inv=supplierInvoices.find(i=>i.id===p.invoiceId);
      const v=vendors.find(x=>x.id===p.vendorId);
      return{vendor:v?.name||p.vendorId,invoice:inv?.invoiceNumber||p.invoiceId,amount:p.amount,currency:p.currency,bank:v?.bankName||"—",account:v?.bankAccount||"—",swift:v?.bankSwift||"—"};
    });
    const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Payment Advice — ${run.batchRef}</title><style>body{font-family:Arial;font-size:11pt;padding:32px;color:#0B0F1A;}h2{color:#FAA819;}table{width:100%;border-collapse:collapse;margin:16px 0;}th{background:#1E2A3A;color:#FAA819;padding:7px 10px;text-align:left;font-size:10pt;}td{padding:6px 10px;border-bottom:1px solid #eee;}</style></head><body><h2>Payment Advice — ${run.batchRef}</h2><p>Date: ${run.runDate} · Entity: ${entities.find(e=>e.id===run.entityId)?.name||run.entityId} · Total: RM ${run.totalAmount.toLocaleString()}</p><table><thead><tr><th>Vendor</th><th>Invoice</th><th>Amount</th><th>Currency</th><th>Bank</th><th>Account</th><th>SWIFT</th></tr></thead><tbody>${lines.map(l=>`<tr><td>${l.vendor}</td><td>${l.invoice}</td><td>${l.amount.toLocaleString()}</td><td>${l.currency}</td><td>${l.bank}</td><td>${l.account}</td><td>${l.swift}</td></tr>`).join("")}</tbody></table><p style="color:#999;font-size:9pt;">Generated by FinFlow · SynerGrowth Consulting · www.synergrowth.com.sg · Confidential</p></body></html>`;
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([html],{type:"text/html"}));a.download="Payment_Advice_"+run.batchRef+".html";a.click();
  }

  const runStatusClr={Draft:P.gold,Approved:P.blue,Processed:P.green};
  const filtRuns=paymentRuns.filter(r=>gf.entityIds.includes(r.entityId));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        <KPI label="Payable Invoices"  value={payableInvoices.length} color={payableInvoices.length>0?P.orange:P.green} accent={P.orange} small sub={fmtK(payableInvoices.reduce((s,i)=>s+toRM(i.amount,i.currency),0))+" MYR"}/>
        <KPI label="Selected"          value={selected.size}          color={P.blue}   small sub={fmtK(totalSelected)+" MYR"}/>
        <KPI label="Payment Runs"      value={filtRuns.length}        color={P.sub}    small/>
        <KPI label="Processed"         value={filtRuns.filter(r=>r.status==="Processed").length} color={P.green} small/>
      </div>

      <SubTabs tabs={[{id:"runs",label:"Payment Runs"},{id:"select",label:"Select & Run"}]} active={tab} onChange={setTab}/>

      {tab==="runs"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtRuns.length===0&&<div style={{color:P.muted,fontSize:12,textAlign:"center",padding:24,background:P.surf2,borderRadius:10}}>No payment runs yet. Go to Select & Run to create one.</div>}
          {filtRuns.map(run=>(
            <Card key={run.id} accent={runStatusClr[run.status]}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:10}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{color:P.gold,fontFamily:"monospace",fontWeight:700,fontSize:12}}>{run.batchRef}</span>
                    <Badge label={run.status} color={runStatusClr[run.status]}/>
                  </div>
                  <div style={{color:P.muted,fontSize:10}}>{run.runDate} · {run.payments.length} payment{run.payments.length!==1?"s":""}</div>
                  {run.status==="Processed"&&<div style={{color:P.green,fontSize:10,marginTop:2}}>✓ GL journal posted · AP records marked paid</div>}
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:P.gold,fontFamily:"monospace",fontSize:18,fontWeight:800}}>{fmtK(run.totalAmount)}</div>
                  <div style={{color:P.muted,fontSize:9}}>MYR equivalent</div>
                </div>
              </div>
              {/* Payment lines */}
              <div style={{marginBottom:10}}>
                {run.payments.map((p,i)=>{
                  const v=vendors.find(x=>x.id===p.vendorId);
                  const inv=supplierInvoices.find(x=>x.id===p.invoiceId);
                  return(
                    <div key={i} style={{display:"flex",gap:10,fontSize:10,color:P.muted,padding:"4px 0",borderBottom:`1px solid ${P.border}20`}}>
                      <span style={{flex:1,color:P.sub,fontWeight:600}}>{v?.name||p.vendorId}</span>
                      <span>{inv?.invoiceNumber||p.invoiceId}</span>
                      <span style={{fontFamily:"monospace",color:P.text}}>{fmtAmt(p.amount,p.currency)}</span>
                      {p.amountMYR&&p.currency!=="MYR"&&<span style={{color:P.muted}}>({fmtMYR(p.amountMYR)})</span>}
                    </div>
                  );
                })}
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {run.status==="Draft"&&<Btn onClick={()=>processRun(run.id)} small color={P.green}>Process & Post to GL</Btn>}
                <Btn onClick={()=>downloadAdvice(run)} small outline color={P.gold}>↓ Payment Advice</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab==="select"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card title="Select Invoices for Payment">
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <Btn onClick={selectAll} small outline color={P.blue}>Select All</Btn>
              <Btn onClick={clearSel} small outline color={P.muted}>Clear</Btn>
              <span style={{color:P.muted,fontSize:11,alignSelf:"center",marginLeft:8}}>{payableInvoices.length} invoices ready for payment</span>
            </div>
            {payableInvoices.length===0&&<div style={{color:P.muted,fontSize:12,padding:12}}>No approved invoices pending payment. Approve invoices in Supplier Invoice module first.</div>}
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {payableInvoices.map(inv=>{
                const v=vendors.find(x=>x.id===inv.vendorId);
                const isSel=selected.has(inv.id);
                return(
                  <div key={inv.id} onClick={()=>toggleSelect(inv.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:9,border:`1px solid ${isSel?P.gold:P.border}`,background:isSel?`${P.gold}10`:P.surf2,cursor:"pointer",transition:"all 0.15s"}}>
                    <div style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${isSel?P.gold:P.border}`,background:isSel?P.gold:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#07090F",flexShrink:0}}>{isSel?"✓":""}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{color:P.text,fontWeight:600,fontSize:12}}>{v?.name||inv.vendorId}</div>
                      <div style={{color:P.muted,fontSize:10}}>{inv.invoiceNumber} · Due {inv.dueDate}</div>
                      {v?.bankAccount&&<div style={{color:P.muted,fontSize:9}}>Bank: {v.bankName} · {v.bankAccount} · {v.bankSwift}</div>}
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{color:P.gold,fontFamily:"monospace",fontSize:13,fontWeight:700}}>{fmtAmt(inv.amount,inv.currency)}</div>
                      {inv.currency!=="MYR"&&<div style={{color:P.muted,fontSize:9}}>{fmtMYR(toRM(inv.amount,inv.currency))}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          {selected.size>0&&(
            <Card title="Payment Batch Summary" accent={P.gold}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:14}}>
                <KPI label="Invoices Selected" value={selected.size}      color={P.blue}  small/>
                <KPI label="Total MYR"          value={fmtK(totalSelected)} color={P.gold} small/>
              </div>
              {Object.entries(byCurrency).map(([ccy,invs])=>(
                <div key={ccy} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${P.border}20`,fontSize:11}}>
                  <span style={{color:P.muted}}>{ccy} payments ({invs.length})</span>
                  <span style={{fontFamily:"monospace",color:P.text,fontWeight:700}}>{fmtAmt(invs.reduce((s,i)=>s+i.amount,0),ccy)}</span>
                </div>
              ))}
              <div style={{marginTop:14}}>
                <Btn onClick={createRun} color={P.gold}>Create Payment Run →</Btn>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
