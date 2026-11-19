$(function() {
    const $variant = $('#three_d_tiles_source_variant');
    const $form = $variant.closest('form');

    const update = function() {
        const variant = $variant.val();
        $form.find('[data-variant]').closest('div').hide();
        $form.find('[data-variant="' + variant + '"]').closest('div').show();
    };

    update();
    $variant.on('change', update);
});
