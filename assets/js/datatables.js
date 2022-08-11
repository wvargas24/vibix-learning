$(document).on('ready', function () {
    // INITIALIZATION OF DATATABLES
    // =======================================================
    HSCore.components.HSDatatables.init($('#datatable'), {
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'copy',
                className: 'd-none'
            },
            {
                extend: 'excel',
                className: 'd-none'
            },
            {
                extend: 'csv',
                className: 'd-none'
            },
            {
                extend: 'pdf',
                className: 'd-none'
            },
            {
                extend: 'print',
                className: 'd-none'
            },
        ],
        select: {
            style: 'multi',
            selector: 'td:first-child input[type="checkbox"]',
            classMap: {
                checkAll: '#datatableCheckAll',
                counter: '#datatableCounter',
                counterInfo: '#datatableCounterInfo'
            }
        },
        language: {
            zeroRecords: `<div class="text-center p-4">
                <img class="mb-3" src="./assets/svg/illustrations/oc-error.svg" alt="Image Description" style="width: 10rem;" data-hs-theme-appearance="default">
                <img class="mb-3" src="./assets/svg/illustrations-light/oc-error.svg" alt="Image Description" style="width: 10rem;" data-hs-theme-appearance="dark">
                <p class="mb-0">No data to show</p>
                </div>`
        }
    })

    const datatable = HSCore.components.HSDatatables.getItem(0)

    $('#export-copy').click(function() {
        datatable.button('.buttons-copy').trigger()
    });

    $('#export-excel').click(function() {
        datatable.button('.buttons-excel').trigger()
    });

    $('#export-csv').click(function() {
        datatable.button('.buttons-csv').trigger()
    });

    $('#export-pdf').click(function() {
        datatable.button('.buttons-pdf').trigger()
    });

    $('#export-print').click(function() {
        datatable.button('.buttons-print').trigger()
    });

    $('.js-datatable-filter').on('change', function() {
        var $this = $(this),
        elVal = $this.val(),
        targetColumnIndex = $this.data('target-column-index');

        if (elVal === 'null') elVal = ''
        console.log(elVal);
        datatable.column(targetColumnIndex).search(elVal).draw();
        $('.js-datatable-clear-filter').css('display','flex');
    });
    
    $('.js-datatable-clear-filter').on('click', function() {
        $(".js-datatable-filter").each(function( index ) {
            var $this = $(this);
            targetColumnIndex = $this.data('target-column-index');
            datatable.column(targetColumnIndex).search('').draw();
            $this.val('');
        });
        $(this).css('display','none');
    });

});
    