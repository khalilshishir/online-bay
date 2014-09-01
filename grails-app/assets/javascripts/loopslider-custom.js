$jx(function () {
	$jx('#loopedSlider').loopedSlider({
		addPagination: true,
		containerClick: false,
		autoStart: 5000
	});
	
	$jx.preload( '.loopslide', {
		onRequest:request,
		onComplete:complete,
		onFinish:finish,
		placeholder:'../images/slider/blank.gif',
		notFound:'../images/slider/error.gif'
	});


	
	function update( data ){

	};
	function complete( data ){
		update( data );

	};
	function request( data ){
		update( data );

	};
	
	function finish(){//hide the summary
		$jx('.container').css('background', 'none');
	};
	
});
