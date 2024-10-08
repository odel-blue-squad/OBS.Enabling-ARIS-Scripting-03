/*
            Java script Rerpot
 -=--=--=--=--=--=--=--=--=--=--=--=--=--=-
 |        This is Prod Report
 |     // OBS Process Manual Report
 |-=--=--=--=--=--=--=--=--=--=--=--=--=--=-
 |--------------
 | Export Format : Word Docx / PDF
 ---------------
 | Coded By : Rakan Omar (KSA OBS)
 | ARIS Beyond Build By : Rakan Omar (KSA OBS)
 | Version : 1.0.0 (03/12/2023)
 ______________
 */

/*-**-**-**-**-**-*
 Some Settings ...
 *-**-**-**-**-**-*/

import { runReport, wordSetup, oOutput, currentDB, currentLocale, log } from "./Core/ARIS_BEYOND_1.0.js";

// import Pages
import { Page_1 } from "./Pages/Page_1.js";
//import { Page_2 } from "./Pages/Page_2.js";
//import { Page_3 } from "./Pages/Page_3.js";

Context.setProperty("use-new-output", true);

wordSetup(oOutput);

const LANG_AR = 1025;
var Filter = currentDB.ActiveFilter();
Filter.setMethodLocale(LANG_AR);
oOutput.setLocale(LANG_AR);

main();

function main() {
  // custom sorting
  Page_1();
  
 

  runReport(oOutput);
}
