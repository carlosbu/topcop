$(document).ready(function(){
    
    getPreviews();
    
});

function getPreviews(){
    var current_slide;
    var id;
    xhrPreview('/getPreviews', function(result){
        var response = (result['enablements']);
        console.log('Result: ' + JSON.stringify(result['enablements']));
        if(result['enablements'] != ''){
            for(var i=0;i<response.length;i++){
                var id = (response[i]['ref']);
                var image = (response[i]['img']);
                $('#gallery').append('<a class="carousel-item" href="/selfenablement/'+id+'"><img src="'+image+'"></a>');
            }
            $('.carousel').carousel({duration: 100,
                indicators: true,
                onCycleTo: function(data) {
                    current_slide = (data[0].toString()).split('selfenablement/')[1];
                    for(var i in response){
                        if(response[i]['ref'] == current_slide){
                            document.getElementById('preview-title').innerText = response[i]['title'];
                        }
                    }
                    // console.log("Current slide: " + current_slide);
                }
            });
        }
    },function(err){
        
    });
}



