const folderId = "set top folder ID of the destination folders"; 

const form = FormApp.getActiveForm();
const formResponses = form.getResponses();
const leng = form.getResponses().length;
const itemResponses = formResponses[leng-1].getItemResponses();
const timeStamps = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss')

function onFormSubmit(e) {

  Utilities.sleep(3000); // why is this here? no one know, it's a mystery
  renameFile();
  createFolder();
  
  // Move files to the folder.
  itemResponses[4].getResponse().forEach(id => DriveApp.getFileById(id).moveTo(folder));
}

function renameFile() 
{
  var fileid = itemResponses[4].getResponse();
  var theFile = DriveApp.getFileById(fileid);
  realName = theFile.getName();
  var newName = itemResponses[0].getResponse() +'_'+ timeStamps +'_'+ realName;
  theFile.setName(newName);
}

function createFolder()
{
  const destFolder = DriveApp.getFolderById(folderId);
  let folderName = itemResponses[0].getResponse();
  const subFolder = destFolder.searchFolders("title contains \"" + folderName + "\"");
  const reg = new RegExp(`^${folderName}$|^${folderName}_\\d{2}$`);
  
  if (subFolder.hasNext()) {
    const folderNames = {};
    while (subFolder.hasNext()) {
      const fol = subFolder.next();
      const fName = fol.getName();
      if (reg.test(fName)) folderNames[fName] = fol;
    }
    const len = Object.keys(folderNames).length;
    if (len == 1 && folderNames[folderName]) {
      folderNames[folderName].setName(folderName + "_01");
    }
    folderName += "_" + ("00" + (len + 1)).slice(-2);
  }
  
  const folder = destFolder.createFolder(folderName);
}


function toCamelCase(str) {
    return str
        .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
}

function titleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}
