$(document).ready(function () {

    //load data into divs
    var id = window.location.href.split('selfenablement/')[1];
    var arrayOfRef = [];


    xhrGet('/getInfo?id=' + id, function (response) {

        if (!response.error) {

            var header = response.data.header;
            var body = response.data.body;
            console.log("Body: " + JSON.stringify(body));
            console.log("Typeof: " + typeof body);

            //Header Infos
            $("#header_title").html(header.title);
            $("#header_trackName").html(header.track_name);
            $("#header_subtitle").html(header.subtitle);
            //


            var chapters = body.chapters;
            var chapters_div = document.getElementById('chapters');

            var str = '';
            for (var c in chapters) {
                str += ' <div class="row my-wrapper valign-wrapper no-border bg-row"><div class="col s2 m2 "><img class="responsive-img right clip-adjust" src="/images/clips.png">' +
                    '</div><div class="col s9  m9 pull-s1"><a href="' + chapters[c].href + '">' +
                    '<p class="white-text bold spaced2 left title">' + chapters[c].title + '</p></a></div></div>';
                str += '<div class="row no-border bg-row"><div class="col s12"><hr class="hr-style"></div></div>';
                str += '<div class="row my-wrapper valign-wrapper bg-row no-border">';
                for (var s in chapters[c].slots) {
                    str += '<div class="col s6 center" style="font-family:Raleway;"><a href="' + chapters[c].slots[s].href + '">' +
                        '<p class="white-text bold p-title" >' + chapters[c].slots[s].title + '</p>';
                    for (var cnt in chapters[c].slots[s].contents) {
                        var margin = (cnt + 1 == chapters[c].slots[s].contents.length) ? ' ' : 'style="margin-bottom:-10px;"';
                        str += ' <p class="white-text p-content" ' + margin + ' >' + chapters[c].slots[s].contents[cnt] + '</p>';

                    }


                    str += '</a></div>';
                    console.log('s: ', s, ' length: ', chapters[c].slots.length)
                    var vhr = (s < chapters[c].slots.length - 1) ? '<hr class="hr-style-ver">' : ' ';
                    console.log('vhr: ', vhr)
                    str += vhr;

                }
                str += '</div>'

                str += '<div class="row no-border bg-row"><div class="col s12"><hr class="hr-style"></div></div>';
            }
            str += '</div>';
            console.log("STR: " + str);

            document.getElementById('chapters').innerHTML = str;
            $('#default-content').addClass('hide'); // Tira o conteudo default.


        }




    }, function (err) {
        console.log(err);
    });
    // end of function of loading data into div

    // Data is now loaded;
    xhrGet('/getPreviews', function (result) {
        var previews = result['enablements'];

        

        for (var i in previews) {
            arrayOfRef.push(previews[i]['ref']);
        }


        console.log(arrayOfRef);

    }, function (err) {

    });


    $('#left-arrow').on('click', function () {
        console.log("Clicou left");
        var newID = (getPrevEnablement(arrayOfRef, id));
        // Adicionar loading activity aqui.
        window.location.href = '/selfenablement/' + newID;
    })

    $('#right-arrow').on('click', function () {
        console.log("Clicou right");
        var newID = (getNextEnablement(arrayOfRef, id));
        // Adicionar loading activity aqui.
        window.location.href = '/selfenablement/' + newID;        
    })


})


function getPrevEnablement(arr, current) {
    var currentP = current.split('#')[0];
    var currentPosP;
    var arrLengthP = arr.length - 1;  
    for(var i in arr){
        if(arr[i] == currentP){
            currentPosP = parseInt(i);
        }
    }


    if(currentPosP == arrLengthP){
        console.log("Case == tamanho");
        return arr[arrLengthP - 1];
    }else if(currentPosP == 0){
        console.log("Case == 0");
        return arr[arrLengthP];
    }else if(currentPosP < arrLengthP && currentPosP > 0){
        console.log("Case dentro do valor valido");
        return arr[currentPosP - 1];
    }
}

function getNextEnablement(arr, current){
    var current = current.split('#')[0];
    var currentPos;
    var arrLength = arr.length -1;
    for(var i in arr){
        if(arr[i] == current){
            currentPos = parseInt(i); 
        }
    }

    if(currentPos == arrLength){
        console.log("Case == tamanho");
        return arr[0];
    }else if(currentPos == 0){
        console.log("Case == 0");
        return arr[currentPos + 1];
    }else if(currentPos < arrLength && currentPos > 0){
        console.log("Case dentro do valor valido");
        return arr[currentPos + 1];
    }

}