$(function() {
    const $variant = $('#three_d_tiles_source_variant');
    const $form = $variant.closest('form');

    const update = function() {
        const variant = $variant.val();
        $form.find('[data-variant]').closest('form > div').hide();
        $form.find('[data-variant="' + variant + '"]').closest('form > div').show();
    };

    update();
    $variant.on('change', update);
});
