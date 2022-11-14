<?php
/* Smarty version 3.1.31, created on 2019-04-03 21:27:16
  from "/home/sites/1a/7/7f76a77624/public_html/forms/install/templates/index.tpl" */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.31',
  'unifunc' => 'content_5ca51724ecabd2_87400274',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '0a1acbd6f36a4fbba7f1f0320ba798ac58908c64' => 
    array (
      0 => '/home/sites/1a/7/7f76a77624/public_html/forms/install/templates/index.tpl',
      1 => 1537241520,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:../../install/templates/install_header.tpl' => 1,
    'file:messages.tpl' => 1,
    'file:../../install/templates/install_footer.tpl' => 1,
  ),
),false)) {
function content_5ca51724ecabd2_87400274 (Smarty_Internal_Template $_smarty_tpl) {
$_smarty_tpl->_subTemplateRender("file:../../install/templates/install_header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>


<h2><?php echo $_smarty_tpl->tpl_vars['LANG']->value['word_welcome'];?>
</h2>

<?php $_smarty_tpl->_subTemplateRender('file:messages.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>


<form action="<?php echo $_smarty_tpl->tpl_vars['same_page']->value;?>
" method="post">
	<table cellspacing="0" cellpadding="0">
		<tr>
			<td width="100" class="label"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['word_language'];?>
</td>
			<td>
				<select name="lang_file" class="margin_right">
					<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['available_languages']->value, 'row');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['row']->value) {
?>
						<option value="<?php echo $_smarty_tpl->tpl_vars['row']->value->code;?>
" <?php if ($_smarty_tpl->tpl_vars['lang']->value == $_smarty_tpl->tpl_vars['row']->value->code) {?>selected<?php }?>><?php echo $_smarty_tpl->tpl_vars['row']->value->lang;?>
</option>
					<?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
?>

				</select>
			</td>
			<td>
				<input type="submit" name="select_language"	 value="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['word_select'];?>
" />
			</td>
		</tr>
	</table>

	<p>
		<input type="submit" name="next" value="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['word_continue_rightarrow'];?>
" />
	</p>
</form>

<?php $_smarty_tpl->_subTemplateRender("file:../../install/templates/install_footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>

<?php }
}
