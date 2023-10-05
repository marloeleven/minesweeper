var Command = function(){
    this.bindings = {};
};

Command.prototype = {
    bind: function(_event, _function){
        if(this.bindings._event !== undefined){
            return;
        }

        this.bindings[_event] = _function;
    },
    trigger: function(_event, _parameter){
        if(!$.inArray(_event, this.bindings)){
            return true;
        }

        this.bindings[_event](_parameter);
    }
};

window.Command = new Command;

module.exports = Command;