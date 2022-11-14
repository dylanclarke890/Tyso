<?php
/* Smarty version 3.1.31, created on 2019-04-03 21:57:04
  from "/home/sites/1a/7/7f76a77624/public_html/forms/themes/default/admin/forms/delete_form.tpl" */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.31',
  'unifunc' => 'content_5ca51e205da248_31704704',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'f3f3a0129e1bd635db42f12645d49b01c0284209' => 
    array (
      0 => '/home/sites/1a/7/7f76a77624/public_html/forms/themes/default/admin/forms/delete_form.tpl',
      1 => 1537241520,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5ca51e205da248_31704704 (Smarty_Internal_Template $_smarty_tpl) {
if (!is_callable('smarty_function_ft_include')) require_once '/home/sites/1a/7/7f76a77624/public_html/forms/global/smarty_plugins/function.ft_include.php';
echo smarty_function_ft_include(array('file'=>'header.tpl'),$_smarty_tpl);?>


  <table cellpadding="0" cellspacing="0" class="margin_bottom_large">
  <tr>
    <td width="45"><img src="<?php echo $_smarty_tpl->tpl_vars['images_url']->value;?>
/icon_forms.gif" width="34" height="34" /></td>
    <td class="title">
	    <a href="./"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['word_forms'];?>
</a> <span class="joiner">&raquo;</span>
	    <a href="./"><?php echo $_smarty_tpl->tpl_vars['form_info']->value['form_name'];?>
</a> (<span class="identifier"><?php echo $_smarty_tpl->tpl_vars['form_id']->value;?>
</span>)
	    <span class="joiner">&raquo;</span>
	    <?php echo $_smarty_tpl->tpl_vars['LANG']->value['phrase_delete_form'];?>

    </td>
  </tr>
  </table>

  <div class="error yellow_bg">
    <div style="padding: 8px;">
      <b><?php echo $_smarty_tpl->tpl_vars['LANG']->value['word_warning_c'];?>
</b> <?php echo $_smarty_tpl->tpl_vars['LANG']->value['text_delete_form_warning'];?>

    </div>
  </div>

  <?php echo smarty_function_ft_include(array('file'=>"messages.tpl"),$_smarty_tpl);?>


  <form method="post" action="<?php echo $_smarty_tpl->tpl_vars['same_page']->value;?>
" onsubmit="return rsv.validate(this, rules)" id="delete_form_form">
    <input type="hidden" name="form_id" value="<?php echo $_smarty_tpl->tpl_vars['form_id']->value;?>
" />
    <input type="checkbox" name="delete_form" id="delete_form" value="yes" />
    <label for="delete_form"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['text_confirm_delete_form'];?>
</label><br />

    <?php if (count($_smarty_tpl->tpl_vars['uploaded_files']->value) > 0) {?>
      <input type="checkbox" name="delete_files" id="delete_files" value="yes" />
      <label for="delete_files"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['text_delete_all_forms'];?>
</label>
      (<a href="#" onclick="page_ns.show_uploaded_files(); return false"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['phrase_view_uploaded_files'];?>
</a>)<br />
    <?php }?>

    <br />
    <input type="button" name="sss" value="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['phrase_return_form_list'];?>
" onclick="window.location='index.php'" />
    <input type="submit" name="sss2" value="<?php echo mb_strtoupper($_smarty_tpl->tpl_vars['LANG']->value['phrase_delete_form'], 'UTF-8');?>
" class="bold" />
  </form>

  <?php if (count($_smarty_tpl->tpl_vars['uploaded_files']->value) > 0) {?>
    <div id="uploaded_files" style="display: none;">
      <br />
      <hr size="1" />
      <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['uploaded_files']->value, 'file_info');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['file_info']->value) {
?>
        <a href="<?php echo $_smarty_tpl->tpl_vars['file_info']->value['folder_url'];?>
/<?php echo $_smarty_tpl->tpl_vars['file_info']->value['filename'];?>
" target="_blank"><?php echo $_smarty_tpl->tpl_vars['file_info']->value['filename'];?>
</a><br />
      <?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
?>

    </div>
  <?php }?>

<?php echo smarty_function_ft_include(array('file'=>'footer.tpl'),$_smarty_tpl);
}
}
