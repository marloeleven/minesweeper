$.fn.lclick = function(callback){
    var _this = this;

    if (callback === undefined)
    {
        _this.triggerHandler("click", { which : 1 });
    }
    else
    {
        (function(_callback)
        {
            _this.click(function(event, options)
            {
                if (event.which == 1 || (options && options.which == 1))
                {
                    _callback.call(this, event);
                }
            });
        })(callback);
    }
};