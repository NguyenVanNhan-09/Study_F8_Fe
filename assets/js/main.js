        const buyBtns = document.querySelectorAll('.js-buy-ticket')
        const modelClose = document.querySelector('.js-model-close')
        const model = document.querySelector('.js-model')
        const modelContainer = document.querySelector('.js-model-container')
        
        
        // hàm hiển thị model (thêm cls open vào model)
        function showBuyTickets(){
            model.classList.add('open')
        }
        // hàm ẩn model (gỡ cls open của model)
        function hideBuyTickets(){
            model.classList.remove('open')
        }

        // lặp qua từng thẻ btn và nghe hành vi click
        for(const buyBtn of buyBtns){
            buyBtn.addEventListener('click', showBuyTickets)
        }
        // nghe hành vi click
        modelClose.addEventListener('click', hideBuyTickets)

        model.addEventListener('click', hideBuyTickets)

        modelContainer.addEventListener('click', function(event){
            event.stopPropagation()
        })
          