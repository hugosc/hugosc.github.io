$(document).ready(function() {

	const term_el = $('#terminal')[0];
	const editor_el = $('#text-editor')[0];

	var term = new Terminal(TERM_CONF); term.open(term_el);
    
    var cm = CodeMirror(editor_el, EDITOR_CONF);
    cm.filepath = 'untitled';

    var url = prompt('Remote url');
    
    var socket = io("http://"+url +":2020");

    socket.on('hello', function(data) {
    	var email = prompt('email');
    	var password = prompt('senha');
    	socket.emit('login', email, password);
        console.log(data);
    });

    term.on('data', function(data) {
        socket.emit('term', data);
    });

    socket.on('term', function(data) {
        term.write(data);
    });

    var send_file = function(file_name) {
    	socket.emit('file', file_name)
    	cm.filepath = file_name;
    }

    socket.on('file', function(data) {
    	console.log(data);
    	cm.setValue(data);
    });

    replace_open(send_file);

    CodeMirror.commands['save'] = function() {
    	const msg = {name:cm.filepath, value:cm.getValue()};
    	console.log(msg)
    	socket.emit('save', msg);
    }
});

function replace_open(handler) {

	const open_button = $('#open-button');
	const orig = open_button.contents();
	const input = $('<input type="text">');

	open_button.on('keypress', function(e) {
		if (e.which == '\r'.charCodeAt(0)) {
			handler(input.val());
		}
	})

	function replace() {
		open_button.html(input);
		console.log('replace');
	}

	function go_back() {
		open_button.html(orig);
		console.log('go back');
	}

	var selected = false;

	open_button.on('click', function() {
		selected = true;
		console.log(selected);
	});

	$('body').on('click', function(e) {
		if (!open_button.has(e.target).length) {
			selected = false;
			go_back();
			console.log(selected);
		}
	});
	
	open_button.on('mouseenter', function() {
		console.log('mouseenter?');
		replace();
	});
	open_button.on('mouseleave', function()  {
		if (!selected) {
			go_back();
		}
	});

}

var TERM_CONF = {
	cursorBlink: true,
    cols: 80, 
    rows: 50
};

var EDITOR_CONF = {
	theme: "monokai",
    lineNumbers: true
};