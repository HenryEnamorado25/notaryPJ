//load a book from disk

const loadBook = (fileName, displayName) => {
    let currentBook = '';
    let url = 'books/' + fileName;

    //reset our UI

    document.getElementById('fileName').innerHTML = displayName;
    document.getElementById('stats').innerHTML = '';
    document.getElementById('keyword').value = "";

    //create a server request to load our books
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();

    xhr.onreadystatechange = () =>{
        if (xhr.readyState == 4 && xhr.status == 200) {
            currentBook = xhr.responseText;

            getDataStats(currentBook);

            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');

            document.getElementById('fileContent').innerHTML = currentBook;
            //remove lines breaks and carriage returns and replace with a <br>
            

            var elmt = document.getElementById("fileContent");
            elmt.scrollTop = 0;
            
        }
    }
}


//get the stats for the books
const getDataStats = (fileContent) => {
  //  var docLength = document.getElementById('docLength');
  //  var wordCount = document.getElementById('wordCount');
    var charCount = document.getElementById('charCount');
    //console.log(docLength);

    let text = fileContent.toLowerCase();
    let wordArray = text.match(/\b\S+\b/g);
    let wordDictionary = {};


    var unCommonWords = [];
    //filter out the uncommon words
    unCommonWords = filterStopWords(wordArray);


    for (let word in unCommonWords) {
       
        let wordValue = unCommonWords[word];
        if (wordDictionary[wordValue] > 0) {
            wordDictionary[wordValue] += 1;
        }
        else {
            wordDictionary[wordValue] = 1;
        }
    }
     

    //sort the array
    let wordList = sortPropeties(wordDictionary);

    //retunr the top 5

    var topWords = wordList.slice(0, 6);

      //retunr the top least 5
    var leastWords = wordList.slice(-6, wordList.lenght);

    //write the values of the page
    ULTemplate(topWords, document.getElementById("mostUsed")); 
    ULTemplate(leastWords, document.getElementById('leastUsed'));
    document.getElementById('stats').innerHTML =
        `<li>Document Length: ${text.length}</li>
        <li>Word Count: ${wordArray.length}</li>`

  

}

const ULTemplate = (items, element)=>{
    let rowTemplate = document.getElementById('template-ul-items');
    let templateHTML = rowTemplate.innerHTML;
    let resultsHTML = '';

    for (let i = 0; i <= items.length - 1; i++){
       
        resultsHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + 'time (s)')  
    }
    element.innerHTML = resultsHTML;
    
}


const sortPropeties = (obj) => {
    //converte the object to a array

    let rntArray = Object.entries(obj);

     //sort the array
    
    rntArray.sort((first, second) => {
        return second[1] - first[1];
        
    })
    return rntArray;
}

//a list of stop words we dont want to include in stats
const getStopWords=()=>{
    return ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any","are","aren't","as","at","be","because","been","before","being","below","between","both","but","by","can't","cannot","could","couldn't","did","didn't","do","does","doesn't","doing","don't","down","during","each","few","for","from","further","had","hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself","let's","me","more","most","mustn't","my","myself","no","nor","not","of","off","on","once","only","or","other","ought","our","ours","ourselves","out","over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't","so","some","such","than","that","that's","the","their","theirs","them","themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up","very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's","where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves"]
}

//filter stop words
const filterStopWords = (wordArray) => {
    var commonWords = getStopWords();
    var commonObj = {};
    var uncommonArr = [];

    for (i = 0; i < commonWords.length; i++){
        commonObj[commonWords[i].trim()] = true;
    }
    for (i = 0; i < wordArray.length; i++){
        word = wordArray[i].trim().toLowerCase();
        if (!commonObj[word]) {
            uncommonArr.push(word);
        }
    }
    return uncommonArr;
}

//mark the words inn the search

const performMark = () => {
    //read the keyboard

    var keyword = document.getElementById('keyword').value;
    var display = document.getElementById('fileContent');
    var newContent = '';
    

    let spans = document.querySelectorAll('mark');

    for (var i = 0; i < spans.length; i++){
        spans[i].outerHTML = spans[i].innerHTML;
    }
        var re = new RegExp(keyword, "gi");
        var replaceTag = "<mark id='markme'>$&</mark>";
    var BookContent = display.innerHTML;
    
    //add the make to the book
    newContent = BookContent.replace(re, replaceTag);
    
    display.innerHTML = newContent;
    var count = document.querySelectorAll('mark').length;
    document.getElementById('searchstat').innerHTML = "found " + count + "matches";

    if (count > 0) {
        var element = document.getElementById("markme");
        element.scrollIntoView();
    }
    
    

}