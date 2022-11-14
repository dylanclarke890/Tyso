<?php
/* Smarty version 3.1.31, created on 2019-04-03 21:31:20
  from "/home/sites/1a/7/7f76a77624/public_html/forms/themes/default/footer.tpl" */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.31',
  'unifunc' => 'content_5ca51818eb4c22_98985983',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '4b2f41e3a57cccbcda312fa2f021c17da88b7eee' => 
    array (
      0 => '/home/sites/1a/7/7f76a77624/public_html/forms/themes/default/footer.tpl',
      1 => 1537241520,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5ca51818eb4c22_98985983 (Smarty_Internal_Template $_smarty_tpl) {
if (!is_callable('smarty_function_show_page_load_time')) require_once '/home/sites/1a/7/7f76a77624/public_html/forms/global/smarty_plugins/function.show_page_load_time.php';
?>

      </div>
    </td>
  </tr>
  </table>

</div>


<?php if ($_smarty_tpl->tpl_vars['footer_text']->value != '' || $_smarty_tpl->tpl_vars['g_enable_benchmarking']->value) {?>
  <div class="footer">
    <?php echo $_smarty_tpl->tpl_vars['footer_text']->value;?>

    <?php echo smarty_function_show_page_load_time(array(),$_smarty_tpl);?>

  </div>
<?php }?>

</body>
</html>
<?php }
}
