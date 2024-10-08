/**
 * Copyright (C) 2022 OBS, Darmstadt, Germany and/or OBS USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * Use, reproduction, transfer, publication or disclosure is prohibited
 * except as specifically provided for in your License Agreement with OBS.
 *
 * Version: 10.0.18.0.1605268
 */

import { oOutput as oOutputFile, RGB, getAttributeValue_fromMobel_ByTypeNumber, currentLocale, ID_DEFAULT_FONT, emptyLine, PAGE_NEW, PAGE_END, TextLine } from "../Core/ARIS_BEYOND_1.0.js";
import { OBSBlue, black, white, lightGray, sectionPageSetup } from "./OBS_BRIDGE.js";

let LANG = "EN";
// Report Configuration
const SHOW_DIALOGS_IN_CONNECT = false; // Show dialogs in ARIS Connect - Default=false (BLUE-12274)

/****************************************************/

// Dialog support depends on script runtime environment (STD resp. BP, TC)
var g_bStandardEnvironment = isDialogSupported();

var g_nLoc = Context.getSelectedLanguage();

var g_aNotAssignedFuncs = new java.util.HashSet();

var g_aModelTypes;
var g_aOrgTypes;
var g_aCxnTypes_R;
var g_aCxnTypes_A;
var g_aCxnTypes_S;
var g_aCxnTypes_C;
var g_aCxnTypes_I;

var g_oProcessModels = new Array();
var g_oDoneModels = new Array();
var g_sModelNames = [getString("TEXT_1")];

/************************************************************************************/

var nHierarchyLevel = 0; // EC-5656 - Hierarchiy level = 0
var bRASCI = false; // BLUE-7440, false: RACI, true: RASCI

/************************************************************************************/

if (!Context.getEnvironment().equals(Constants.ENVIRONMENT_BP)) {
  // Never show dialog in Business Publisher
  //   var aOptions = showOptionsDialog(g_bStandardEnvironment);
  //   if (aOptions != null) {
  //     nHierarchyLevel = aOptions[1];
  //     bRASCI = aOptions[0] == 1;
  //   } else {
  //     nHierarchyLevel = null;
  //   }
}

/************************************************************************************/
// fill Array with data information
function getData(oFuncObjects, oOrgObjects, oProcessModel) {
  var arrOuter = new Array();

  for (var i = 0; i < oFuncObjects.length; i++) {
    var oFuncObject = oFuncObjects[i];

    var arrInner = new Array();

    for (var j = 0; j < oOrgObjects.length; j++) {
      var oOrgObject = oOrgObjects[j];

      var result = getRASCIValue(oFuncObject, oOrgObject, oProcessModel);
      var nCellColor = Constants.C_TRANSPARENT;
      var nCount = 0;

      if (result.indexOf("R") >= 0 || result.indexOf("م") >= 0) {
        var nCellColor = Constants.C_GREY_80_PERCENT;
        nCount = nCount + 100000;
      }
      if (result.indexOf("A") >= 0 || result.indexOf("ع") >= 0) {
        var nCellColor = Constants.C_GREY_80_PERCENT;
        nCount = nCount + 10000;
      }
      if (result.indexOf("S") >= 0 || result.indexOf("S") >= 0) {
        var nCellColor = Constants.C_GREY_80_PERCENT;
        nCount = nCount + 1000;
      }
      if (result.indexOf("C") >= 0 || result.indexOf("س") >= 0) {
        var nCellColor = Constants.C_GREY_80_PERCENT;
        nCount = nCount + 100;
      }
      if (result.indexOf("I") >= 0 || result.indexOf("ط") >= 0) {
        var nCellColor = Constants.C_GREY_80_PERCENT;
        nCount = nCount + 10;
      }

      if (result.length > 1) {
        // multiple entries like "R, A, ..."
        nCellColor = nCellColor = Constants.C_LIME;
      }

      var myOut = new myOutput(oFuncObject, oOrgObject);
      myOut.rasciValue = result;
      myOut.colour = nCellColor;
      myOut.nCount = nCount;
      arrInner.push(myOut);
    }
    if (arrInner.length > 0) arrOuter.push(arrInner);
  }
  return arrOuter;
}

//Output
function outTables(arrOuter, sProcessName, bCheckFuncAssignments) {
  var nMAX_COUNT = 100;

  if (arrOuter.length <= 0) return;

  arrOuter = sortArray(arrOuter);

  var nCount = 0;
  var bLoop = true;
  var nStart = 0;
  var nEnd = nStart + nMAX_COUNT;
  if (nEnd > arrOuter[0].length) nEnd = arrOuter[0].length;

  while (bLoop) {
    var autoSize = 88 / arrOuter[0].length;
    oOutputFile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
    oOutputFile.TableRow();
    if (bCheckFuncAssignments) {
      /***********/
      // oOutputFile.TableCell("#", 5, ID_DEFAULT_FONT, 10, Constants.C_WHITE, RGB(OBSBlue), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
      /*************/
    }
    oOutputFile.ResetFrameStyle();
    oOutputFile.SetFrameStyle(Constants.FRAME_BOTTOM, 10); // 0: zeichnet z.B. keine */
    // by rakan

    oOutputFile.TableCell("أصحاب المصلحة/الخطوات", 12, ID_DEFAULT_FONT, 7, Constants.C_WHITE, RGB(OBSBlue), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);

    for (var j = nStart; j < nEnd; j++) {
      oOutputFile.TableCell(arrOuter[0][j].orgElemDef.Name(g_nLoc), autoSize, ID_DEFAULT_FONT, 7, Constants.C_WHITE, RGB(OBSBlue), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VCENTER, 0); // | Constants.FMT_VERT_UP
    }

    for (var i = 0; i < arrOuter.length; i++) {
      if (hasFunctionAworth(arrOuter[i]) == true) {
        oOutputFile.TableRow();

        if (bCheckFuncAssignments) {
          // by rakan show activity code
          // var Activity_Code_from_thisTask = arrOuter[i][0].funcDef.Attribute(ArisData.ActiveFilter().UserDefinedAttributeTypeNum("a6ea5c20-fc0e-11ea-26c3-00505689145e"), g_nLoc).getValue();
          // oOutputFile.TableCell(Activity_Code_from_thisTask, 5, ID_DEFAULT_FONT, 10, Constants.C_WHITE, RGB(OBSBlue), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
        }
        oOutputFile.TableCell(arrOuter[i][0].funcDef.Name(g_nLoc), 12, ID_DEFAULT_FONT, 7, Constants.C_WHITE, RGB(OBSBlue), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);

        for (var j = nStart; j < nEnd; j++) {
          oOutputFile.TableCell(arrOuter[i][j].rasciValue, autoSize, ID_DEFAULT_FONT, 7, Constants.C_BLACK, arrOuter[i][j].colour, 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
        }
      } else {
        if (bCheckFuncAssignments) {
          g_aNotAssignedFuncs.add(arrOuter[i][0].funcDef);
        }
      }
    }
    var sTableName = sProcessName;
    if (nCount > 0) sTableName = "" + (nCount + 1) + ". " + sProcessName;
    oOutputFile.EndTable("", 100, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);

    if (nEnd == arrOuter[0].length) {
      bLoop = false;
    } else {
      bLoop = false; // stop on max  columns
      nStart = nEnd;
      nEnd = nStart + nMAX_COUNT;
      if (nEnd > arrOuter[0].length) nEnd = arrOuter[0].length;
      nCount++;
    }
  }
}

// Output of the functions which are not in List
function outNotAssignedFuncsList() {
  oOutputFile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
  for (var iter = g_aNotAssignedFuncs.iterator(); iter.hasNext(); ) {
    var func = iter.next();
    oOutputFile.TableRow();
    oOutputFile.TableCell(func.Name(g_nLoc), 20, getString("TEXT_3"), 10, Constants.C_BLACK, new java.awt.Color(0.72265625, 0.99609375, 0.72265625).getRGB(), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
    oOutputFile.TableCell(getProcessAssignment(func), 20, getString("TEXT_3"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
  }
  oOutputFile.EndTable(getString("TEXT_4"), 100, getString("TEXT_3"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
}

function getProcessAssignment(funcDef) {
  var sModelList = "";
  var oObjOccList = funcDef.OccList();
  for (var i = 0; i < oObjOccList.length; i++) {
    var oObjOcc = oObjOccList[i];
    var oModel = oObjOcc.Model();

    if (isModelInList(oModel, g_oProcessModels, false /*p_bAddToList*/)) {
      if (sModelList.length > 0) sModelList = sModelList + ", ";
      sModelList = sModelList + oModel.Name(g_nLoc);
      sModelList = sModelList + oModel.Name(g_nLoc);
    }
  }
  return sModelList;
}

//
function hasFunctionAworth(p_arrInner) {
  var nCount = 0;
  for (var i = 0; i < p_arrInner.length; i++) {
    nCount = nCount + p_arrInner[i].nCount;
  }
  return nCount > 0;
}

function getProcessModels(p_nMaxHierarchyLevel) {
  var oProcessModels = new Array();
  var oSelModels = getModelSelection(); // BLUE-10824 Context extended to model + group
  // get relevant process models
  for (var i = 0; i < oSelModels.length; i++) {
    var oModel = oSelModels[i];
    addProcessModel(oModel, oProcessModels, 0, p_nMaxHierarchyLevel);
  }
  return oProcessModels;
}

function getModelSelection() {
  // Models selected
  var oSelModels = ArisData.getSelectedModels();
  if (oSelModels.length > 0) return oSelModels;

  // Groups selected
  var aModelTypes = Context.getDefinedItemTypes(Constants.CID_MODEL);
  oSelModels = new Array();
  var oSelGroups = ArisData.getSelectedGroups();
  for (var i = 0; i < oSelGroups.length; i++) {
    oSelModels = oSelModels.concat(filterModels(oSelGroups[i], aModelTypes));
  }
  return oSelModels;

  function filterModels(oGroup, aTypeNums) {
    if (aTypeNums.length == 0 || (aTypeNums.length == 1 && aTypeNums[0] == -1)) {
      // All/None type nums selected
      return oGroup.ModelList();
    }
    return oGroup.ModelList(false /* bRecursive*/, aTypeNums);
  }
}

function addProcessModel(p_oModel, p_oProcessModels, p_nHierarchyLevel, p_nMaxHierarchyLevel) {
  if (!isModelInList(p_oModel, g_oDoneModels, true /*p_bAddToList*/)) {
    var bCheck = checkTypeNum(p_oModel.OrgModelTypeNum(), g_aModelTypes);
    if (bCheck == true) {
      p_oProcessModels.push(p_oModel);

      if (p_nHierarchyLevel < p_nMaxHierarchyLevel) {
        addHierarchyModels(p_oModel, p_oProcessModels, p_nHierarchyLevel + 1);
      }
    }
  }

  function addHierarchyModels(p_oModel, p_oProcessModels, p_nHierarchyLevel) {
    var oFuncDefs = p_oModel.ObjDefListFilter(Constants.OT_FUNC);
    for (var i = 0; i < oFuncDefs.length; i++) {
      var oFuncDef = oFuncDefs[i];
      var oAssignedModels = oFuncDef.AssignedModels();

      for (var j = 0; j < oAssignedModels.length; j++) {
        addProcessModel(oAssignedModels[j], p_oProcessModels, p_nHierarchyLevel, p_nMaxHierarchyLevel);
      }
    }
  }
}

function isModelInList(p_oModel, p_oModelList, p_bAddToList) {
  for (var i = 0; i < p_oModelList.length; i++) {
    if (p_oModel.IsEqual(p_oModelList[i])) return true;
  }
  if (p_bAddToList) {
    // AGA-5707, Call-ID 297980
    p_oModelList.push(p_oModel);
  }
  return false;
}

function getFunctionObjects(p_oProcessModels) {
  var oFuncObjects = new Array();
  for (var i in p_oProcessModels) {
    var oFuncDefs = p_oProcessModels[i].ObjDefListFilter(Constants.OT_FUNC);
    oFuncObjects = oFuncObjects.concat(oFuncDefs);
  }
  oFuncObjects = ArisData.Unique(oFuncObjects);
  // // sort by activity code
  // let Activity_Code_value = ArisData.ActiveFilter().UserDefinedAttributeTypeNum("a6ea5c20-fc0e-11ea-26c3-00505689145e");
  // // convert Activity_Code_value to string
  // Activity_Code_value = Activity_Code_value.toString();
  // // convert any hinid number to english number
  // let Activity_Code_english_number = Activity_Code_value.replace(/[\u0660-\u0669]/g, function (c) {
  //   return c.charCodeAt(0) - 0x0660;
  // });

  // oFuncObjects = ArisData.sort(oFuncObjects, Activity_Code_english_number, g_nLoc);
  return oFuncObjects;
}

function getOrgObjects(p_oProcessModels) {
  var oOrgObjects = new Array();
  for (var i in p_oProcessModels) {
    var oProcessModel = p_oProcessModels[i];
    oOrgObjects = oOrgObjects.concat(getOrgElements(oProcessModel));
    // BLUE-6519
    var oAssignedFadModels = getAssignedFadModels(oProcessModel);
    for (var j in oAssignedFadModels) {
      oOrgObjects = oOrgObjects.concat(getOrgElements(oAssignedFadModels[j]));
    }
  }
  oOrgObjects = ArisData.Unique(oOrgObjects);
  return oOrgObjects;

  function getOrgElements(p_oModel) {
    var oOrgDefs = new Array();
    var oObjDefs = p_oModel.ObjDefList();
    for (var i in oObjDefs) {
      var oObjDef = oObjDefs[i];
      if (checkTypeNum(oObjDef.TypeNum(), g_aOrgTypes)) {
        oOrgDefs.push(oObjDef);
      }
    }
    return oOrgDefs;
  }

  function getAssignedFadModels(p_oModel) {
    var oAssignedFadModels = new Array();
    var oFuncDefs = p_oModel.ObjDefListFilter(Constants.OT_FUNC);
    for (var i in oFuncDefs) {
      oAssignedFadModels = oAssignedFadModels.concat(oFuncDefs[i].AssignedModels(Constants.MT_FUNC_ALLOC_DGM));
    }
    return oAssignedFadModels;
  }
}

function getRASCIValue(p_oFuncObject, p_oOrgObject, p_oModel) {
  var sRasciValue = "";
  var oRASCICxns = new Array();

  var oCxns = getRASCICxns(p_oFuncObject, p_oOrgObject, p_oModel);
  for (var i = 0; i < oCxns.length; i++) {
    oCxn = oCxns[i];
    // R
    var bCheck = checkTypeNum(oCxn.TypeNum(), g_aCxnTypes_R);
    if (bCheck == true && LANG == "EN") sRasciValue = writeRasciValue(sRasciValue, "R"); //return "R";
    if (bCheck == true && LANG == "AR") sRasciValue = writeRasciValue(sRasciValue, "م"); //return "R";
    // A
    var bCheck = checkTypeNum(oCxn.TypeNum(), g_aCxnTypes_A);
    if (bCheck == true && LANG == "EN") sRasciValue = writeRasciValue(sRasciValue, "A"); //return "A";
    if (bCheck == true && LANG == "AR") sRasciValue = writeRasciValue(sRasciValue, "ع"); //return "A";
    // S
    var bCheck = checkTypeNum(oCxn.TypeNum(), g_aCxnTypes_S);
    if (bCheck == true && LANG == "EN") sRasciValue = writeRasciValue(sRasciValue, "S"); //return "S";
    if (bCheck == true && LANG == "AR") sRasciValue = writeRasciValue(sRasciValue, "S"); //return "S";
    // C
    var bCheck = checkTypeNum(oCxn.TypeNum(), g_aCxnTypes_C);
    if (bCheck == true && LANG == "EN") sRasciValue = writeRasciValue(sRasciValue, "C"); //return "C";
    if (bCheck == true && LANG == "AR") sRasciValue = writeRasciValue(sRasciValue, "س"); //return "C";
    // I
    var bCheck = checkTypeNum(oCxn.TypeNum(), g_aCxnTypes_I);
    if (bCheck == true && LANG == "EN") sRasciValue = writeRasciValue(sRasciValue, "I"); //return "I";
    if (bCheck == true && LANG == "AR") sRasciValue = writeRasciValue(sRasciValue, "ط"); //return "I";
  }
  return sRasciValue;
}

function writeRasciValue(sRasciValue, sCurrentValue) {
  if (sRasciValue.length > 0) {
    sRasciValue = sRasciValue + ", ";
  }
  sRasciValue = sRasciValue + sCurrentValue;
  return sRasciValue;
}

function getRASCICxns(p_oFuncObject, p_oOrgObject, p_oModel) {
  // RichClient, all models -> Evaluate all cxn defs
  if (g_bStandardEnvironment && p_oModel == null) {
    return filterCxns(p_oFuncObject.CxnList(getDirection()));
  }
  // else evaluate cxn occs in relevant models
  var oRelevantCxns = new Array();
  var oModels = getRelevantModels();
  for (var i in oModels) {
    var oFuncObjOccs = p_oFuncObject.OccListInModel(oModels[i]);
    oFuncObjOccs = oFuncObjOccs.concat(getFuncOccsInAssignedFadModel()); // BLUE-6519

    for (var j in oFuncObjOccs) {
      oRelevantCxns = oRelevantCxns.concat(getRelevantCxns(oFuncObjOccs[j]));
    }
  }
  return ArisData.Unique(oRelevantCxns);

  function getRelevantModels() {
    if (p_oModel == null) return g_oProcessModels;
    return [p_oModel];
  }

  function getRelevantCxns(oFuncObjOcc) {
    var oCxnOccs = getFunctionCxns();
    return filterCxns(oCxnOccs);

    function getFunctionCxns() {
      if (getDirection() == Constants.EDGES_OUT) return oFuncObjOcc.OutEdges(Constants.EDGES_ALL);
      else return oFuncObjOcc.InEdges(Constants.EDGES_ALL);
    }
  }

  function getDirection() {
    if (p_oOrgObject.TypeNum() == Constants.OT_SYS_ORG_UNIT_TYPE) return Constants.EDGES_OUT;
    else return Constants.EDGES_IN;
  }

  function filterCxns(oCxns) {
    var oFilteredCxns = new Array();
    for (var i in oCxns) {
      var oCxn = oCxns[i];
      if (oCxn.KindNum() == Constants.CID_CXNOCC) oCxn = oCxn.Cxn();

      var oConnObjDef = getConnObjDef(oCxn);

      if (p_oOrgObject.IsEqual(oConnObjDef)) {
        oFilteredCxns.push(oCxn);
      }
    }
    return oFilteredCxns;
  }

  function getConnObjDef(oCxn) {
    if (getDirection() == Constants.EDGES_OUT) return oCxn.TargetObjDef();
    else return oCxn.SourceObjDef();
  }

  function getFuncOccsInAssignedFadModel() {
    var oAssignedFuncOccs = new Array();
    var oAssignedFadModels = p_oFuncObject.AssignedModels(Constants.MT_FUNC_ALLOC_DGM);
    for (var i in oAssignedFadModels) {
      var oFuncOccs = p_oFuncObject.OccListInModel(oAssignedFadModels[i]);
      if (oFuncOccs.length > 0) {
        oAssignedFuncOccs = oAssignedFuncOccs.concat(oFuncOccs);
      }
    }
    return oAssignedFuncOccs;
  }
}

// check typenum
function checkTypeNum(p_nType, p_aTypes) {
  for (var i = 0; i < p_aTypes?.length; i++) {
    if (p_nType == p_aTypes[i]) return true;
  }
  return false;
}

// init list of model types
function initModelTypes() {
  return [
    // Constants.MT_EEPC,
    // Constants.MT_EEPC_COLUMN,
    // Constants.MT_EEPC_MAT,
    // Constants.MT_EEPC_ROW,
    // Constants.MT_EEPC_TAB,
    // Constants.MT_EEPC_TAB_HORIZONTAL,
    Constants.MT_VAL_ADD_CHN_DGM,
    // Constants.MT_BPMN_COLLABORATION_DIAGRAM,
    // Constants.MT_BPMN_PROCESS_DIAGRAM,
    // Constants.MT_ENTERPRISE_BPMN_COLLABORATION,
    // Constants.MT_ENTERPRISE_BPMN_PROCESS,
  ];
}

// init list of org types
function initOrgTypes() {
  return [Constants.OT_PERS, Constants.OT_POS, Constants.OT_GRP, Constants.OT_ORG_UNIT_TYPE, Constants.OT_ORG_UNIT, Constants.OT_PERS_TYPE];
}

//init list of Cxn types "Responsible"
function initCxnTypes_R() {
  return [Constants.CT_EXEC_1, Constants.CT_EXEC_2];
}

//init list of Cxn types "Accountable"
function initCxnTypes_A() {
  return [Constants.CT_DECID_ON, Constants.CT_DECD_ON, Constants.CT_AGREES];
}

//init list of Cxn types "Supportive"
function initCxnTypes_S(bRASCI) {
  if (!bRASCI) return [];
  return [Constants.CT_CONTR_TO_1, Constants.CT_CONTR_TO_2];
}

//init list of Cxn types "Consulted"
function initCxnTypes_C() {
  return [Constants.CT_IS_TECH_RESP_1, Constants.CT_IS_TECH_RESP_3, Constants.CT_HAS_CONSLT_ROLE_IN_1, Constants.CT_HAS_CONSLT_ROLE_IN_2];
}

//init list of Cxn types "Informed"
function initCxnTypes_I() {
  return [Constants.CT_MUST_BE_INFO_ABT_1, Constants.CT_MUST_BE_INFO_ON_CNC_1, Constants.CT_MUST_BE_INFO_ABT_2, Constants.CT_MUST_BE_INFO_ON_CNC_2];
}

function myOutput(p_funcDef, p_orgElemDef) {
  this.funcDef = p_funcDef;
  this.orgElemDef = p_orgElemDef;
  this.rasciValue = "";
  this.nCount = 0;
  this.colour = Constants.C_TRANSPARENT;
}

function sortArray(aArray) {
  if (aArray.length > 0 && aArray[0].length > 0) {
    var aTmpArray = turnArray(aArray);

    aTmpArray.sort(sortRasci);
    return turnArray(aTmpArray);
  }

  return aArray;
}

function sortRasci(a, b) {
  return getSum(b) - getSum(a);
}

function getSum(innerArray) {
  var sum = 0;
  for (var i = 0; i < innerArray.length; i++) {
    sum = sum + innerArray[i].nCount;
  }
  return sum;
}

function turnArray(aArray) {
  var aNewOuter = new Array();

  if (aArray.length > 0) {
    var innerMax = aArray[0].length;
    for (var inner = 0; inner < innerMax; inner++) {
      var aNewInner = new Array();
      for (var outer = 0; outer < aArray.length; outer++) {
        aNewInner.push(aArray[outer][inner]);
      }
      aNewOuter.push(aNewInner);
    }
  }
  return aNewOuter;
}

function getModelName(modelName) {
  var nIdx = 1;
  var modelName = getValidName(modelName);
  while (!isAllowedName(modelName)) {
    modelName = modelName.substr(0, modelName.length - 3) + formatstring1("(@1)", nIdx++);
  }
  g_sModelNames.push(modelName.toLowerCase());
  return modelName;

  function isAllowedName(modelName) {
    for (var i = 0; i < g_sModelNames.length; i++) {
      if (StrComp(modelName.toLowerCase(), g_sModelNames[i]) == 0) return false;
    }
    return true;
  }

  function getValidName(sName) {
    sName = "" + sName;
    var npos = serchforspecialchar(sName);
    if (npos >= 0 && npos <= 31) {
      nPos = Math.min(npos, 28);
      sName = sName.substr(0, npos) + "...";
    }
    if (sName.length > 31) {
      sName = sName.substr(0, 28) + "...";
    }
    return sName;
  }
}

function showOptionsDialog(bSelectHierarchyLevel) {
  var nHierarchyLevel = 0;

  var binput = false; // Variable to check if input is correct
  var nuserdlg = 0; // Variable to check if the user choose in the dialog the alternative "cancel"
  while (binput == false && !(nuserdlg == 1)) {
    var userdialog = Dialogs.createNewDialogTemplate(0, 0, 450, 120, getString("TEXT_5"));

    // BLUE-13058 Select between RACI and RASCI
    userdialog.GroupBox(10, 10, 440, 50, getString("TEXT_12"));
    userdialog.OptionGroup("optType");
    userdialog.OptionButton(20, 25, 300, 15, getString("TEXT_13"));
    userdialog.OptionButton(20, 40, 300, 15, getString("TEXT_14"));

    if (bSelectHierarchyLevel) {
      userdialog.GroupBox(10, 70, 440, 50, getString("TEXT_6"));
      userdialog.Text(20, 85, 140, 15, getString("TEXT_6"));
      userdialog.TextBox(185, 85, 60, 21, "txtLinkLevels"), 0, getString("TEXT_6");
    }
    userdialog.OKButton();
    userdialog.CancelButton();
    //userdialog.HelpButton("HID_277051f0_77e9_11dc_0f7d_0014224a1763_dlg_01.hlp");

    var dlg = Dialogs.createUserDialog(userdialog);

    if (bSelectHierarchyLevel) {
      dlg.setDlgText("txtLinkLevels", nHierarchyLevel);
    }
    nuserdlg = Dialogs.show((__currentDialog = dlg)); // Show Dialog and waiting for confirmation with  OK

    if (bSelectHierarchyLevel) {
      nHierarchyLevel = dlg.getDlgText("txtLinkLevels");
      if (isNaN(nHierarchyLevel)) {
        Dialogs.MsgBox(getString("TEXT_7"), Constants.MSGBOX_BTN_OK, getString("TEXT_8"));
      } else {
        nHierarchyLevel = parseInt(nHierarchyLevel);
        if (nHierarchyLevel < 0) {
          Dialogs.MsgBox(getString("TEXT_9"), Constants.MSGBOX_BTN_OK, getString("TEXT_8"));
        } else {
          binput = true;
        }
      }
      if (!binput) nHierarchyLevel = 0;
    } else {
      binput = true;
    }
    var nMatrixType = dlg.getDlgValue("optType");
  }
  if (nuserdlg == 0) return null;
  return [nMatrixType, nHierarchyLevel];
}

function outEmptyResult() {
  oOutputFile = Context.createOutputObject();
  oOutputFile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
  oOutputFile.TableRow();
  oOutputFile.TableCell(getString("TEXT_11"), 100, getString("TEXT_3"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER | Constants.FMT_EXCELMODIFY, 0);
  oOutputFile.EndTable("", 100, getString("TEXT_3"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
  oOutputFile.WriteReport();
}

function isDialogSupported() {
  // Dialog support depends on script runtime environment (STD resp. BP, TC)
  var env = Context.getEnvironment();
  if (env.equals(Constants.ENVIRONMENT_STD)) return true;
  if (env.equals(Constants.ENVIRONMENT_TC)) return SHOW_DIALOGS_IN_CONNECT;
  return false;
}

// BY RAKAN TO INTERGRATE WITH THE NEW ARIS BEYOND 1.0

export function print_raci_now() {
  g_aModelTypes = initModelTypes();
  g_aOrgTypes = initOrgTypes();
  g_aCxnTypes_R = initCxnTypes_R();
  g_aCxnTypes_A = initCxnTypes_A();
  g_aCxnTypes_S = initCxnTypes_S(bRASCI);
  g_aCxnTypes_C = initCxnTypes_C();
  g_aCxnTypes_I = initCxnTypes_I();
  g_oProcessModels = getProcessModels(3);
  if (g_oProcessModels.length > 0) {
    for (let i = 0; i < g_oProcessModels.length; i++) {
      var oModel = g_oProcessModels[i];
      var modelName = getModelName(oModel.Name(g_nLoc));
      var oFuncDefs = getFunctionObjects([oModel]);
      var oOrgDefs = getOrgObjects([oModel]);
      var arrOuter = getData(oFuncDefs, oOrgDefs, oModel);

      PAGE_NEW(oOutputFile, false);

      sectionPageSetup(oOutputFile);
      emptyLine(oOutputFile);

      if (i === 0) {
        oOutputFile.OutputLn("2.3. مصفوفة توزيع الأدوار والمسؤوليات (RACI)", ID_DEFAULT_FONT, 14, RGB(black), Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_TOCENTRY1, 0);
        emptyLine(oOutputFile);
      }

      oOutputFile.OutputLn("2.3." + parseInt(i + 1) + ". مصفوفة : " + oModel.Name(g_nLoc), ID_DEFAULT_FONT, 14, RGB(black), Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_TOCENTRY2, 0);
      emptyLine(oOutputFile);

      outTables(arrOuter, modelName, true);
      emptyLine(oOutputFile);
      oOutputFile.BeginTable(100, RGB(black), RGB(black), Constants.FMT_LEFT, 0);
      oOutputFile.TableRow();
      oOutputFile.ResetFrameStyle();
      oOutputFile.TableCell("", 100 * 0.15, ID_DEFAULT_FONT, 10, RGB(white), RGB(OBSBlue), 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
      TextLine("تعريفات المصفوفه", 10, "center", white);
      oOutputFile.TableCell("", 100 * 0.85, ID_DEFAULT_FONT, 10, RGB(white), RGB(OBSBlue), 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
      oOutputFile.BeginTable(100, RGB(black), RGB(black), Constants.FMT_LEFT, 0);
      oOutputFile.TableRow();
      oOutputFile.ResetFrameStyle();
      oOutputFile.TableCell("", 100 / 4, ID_DEFAULT_FONT, 10, RGB(white), RGB(OBSBlue), 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
      TextLine("مسؤول", 10, "left", white);
      oOutputFile.TableCell("", 100 / 4, ID_DEFAULT_FONT, 10, RGB(white), RGB(OBSBlue), 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
      TextLine("مساءل", 10, "left", white);
      oOutputFile.TableCell("", 100 / 4, ID_DEFAULT_FONT, 10, RGB(white), RGB(OBSBlue), 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
      TextLine("مستشار", 10, "left", white);
      oOutputFile.TableCell("", 100 / 4, ID_DEFAULT_FONT, 10, RGB(white), RGB(OBSBlue), 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
      TextLine("للإبلاغ", 10, "left", white);
      oOutputFile.TableRow();
      oOutputFile.ResetFrameStyle();
      oOutputFile.TableCell("", 100 / 4, ID_DEFAULT_FONT, 10, Constants.C_BLACK, RGB(white), 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
      TextLine("R", 10, "left", black);
      oOutputFile.TableCell("", 100 / 4, ID_DEFAULT_FONT, 10, Constants.C_BLACK, RGB(white), 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
      TextLine("A", 10, "left", black);
      oOutputFile.TableCell("", 100 / 4, ID_DEFAULT_FONT, 10, Constants.C_BLACK, RGB(white), 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
      TextLine("C", 10, "left", black);
      oOutputFile.TableCell("", 100 / 4, ID_DEFAULT_FONT, 10, Constants.C_BLACK, RGB(white), 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
      TextLine("I", 10, "left", black);
      oOutputFile.EndTable("", 100, ID_DEFAULT_FONT, 10, Constants.C_BLACK, RGB(white), 0, Constants.FMT_LEFT, 0);
      oOutputFile.EndTable("", 100, ID_DEFAULT_FONT, 10, Constants.C_BLACK, RGB(white), 0, Constants.FMT_LEFT, 0);

      PAGE_END(oOutputFile);
    }
  }
}
