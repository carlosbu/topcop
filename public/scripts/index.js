

function loadData() {
    var id = window.location.href.split('selfenablement/')[1];

    xhrGet('/getInfo?id=' + id, function (response) {

        if (!response.error) {

            var header = response.data.header;
            var body = response.data.body;

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
                    '</div><div class="col s9  m9 pull-s1"><a href="'+ chapters[c].href +'">' +
                    '<p class="white-text bold spaced2 left title">' + chapters[c].title + '</p></a></div></div>';
                    str+= '<div class="row no-border bg-row"><div class="col s12"><hr class="hr-style"></div></div>';
                    str+= '<div class="row my-wrapper valign-wrapper bg-row no-border">';
                for (var s in chapters[c].slots) {
                    str += '<div class="col s6 center" style="font-family:Raleway;"><a href="'+ chapters[c].slots[s].href + '">' +
                        '<p class="white-text bold p-title" >' + chapters[c].slots[s].title + '</p>';
                    for (var cnt in chapters[c].slots[s].contents) {
                        var margin = (cnt + 1 == chapters[c].slots[s].contents.length) ? ' ' : 'style="margin-bottom:-10px;"';
                        str += ' <p class="white-text p-content" ' +margin+ ' >' + chapters[c].slots[s].contents[cnt] + '</p>';
                         
                    }
                

                    str += '</a></div>';
                    console.log('s: ',s, ' length: ' ,chapters[c].slots.length)
                        var vhr = (s < chapters[c].slots.length - 1)?'<hr class="hr-style-ver">':' '; 
                        console.log('vhr: ',vhr)
                    str+= vhr;

                }
                str+= '</div>'

                str += '<div class="row no-border bg-row"><div class="col s12"><hr class="hr-style"></div></div>';
            }
            str += '</div>';

            chapters_div.innerHTML = str;
        }




    }, function (err) {

    })


}


loadData();