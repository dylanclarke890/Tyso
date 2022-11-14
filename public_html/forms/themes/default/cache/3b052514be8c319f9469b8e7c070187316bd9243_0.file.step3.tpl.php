<?php
/* Smarty version 3.1.31, created on 2019-04-03 21:27:49
  from "/home/sites/1a/7/7f76a77624/public_html/forms/install/templates/step3.tpl" */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.31',
  'unifunc' => 'content_5ca51745010d77_46320083',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '3b052514be8c319f9469b8e7c070187316bd9243' => 
    array (
      0 => '/home/sites/1a/7/7f76a77624/public_html/forms/install/templates/step3.tpl',
      1 => 1537241520,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:../../install/templates/install_header.tpl' => 1,
    'file:messages.tpl' => 3,
    'file:../../install/templates/install_footer.tpl' => 1,
  ),
),false)) {
function content_5ca51745010d77_46320083 (Smarty_Internal_Template $_smarty_tpl) {
$_smarty_tpl->_subTemplateRender("file:../../install/templates/install_header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>


<?php if ($_smarty_tpl->tpl_vars['tables_already_exist']->value) {?>

	<h2>Tables already exist!</h2>

	<?php $_smarty_tpl->_subTemplateRender('file:messages.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>


	<div class="error margin_bottom_large">
		<div style="padding: 6px">
			<b>Warning!</b> It appears that some tables already exist with the table prefix that you specified
			(see list below). You can either choose to overwrite these tables or pick a new table prefix.
		</div>
	</div>

	<div id="existing_tables"><blockquote><pre>
<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['existing_tables']->value, 'table');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['table']->value) {
echo $_smarty_tpl->tpl_vars['table']->value;?>

<?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
?>

</pre></blockquote></div>

	<form action="<?php echo $_smarty_tpl->tpl_vars['same_page']->value;?>
" method="post">
		<p>
			<input type="submit" name="overwrite_tables" value="Overwrite Tables" class="red" />
			<input type="submit" name="pick_new_table_prefix" value="Pick New Table Prefix" />
		</p>
	</form>

<?php } else { ?>

	<h2><?php echo $_smarty_tpl->tpl_vars['LANG']->value['phrase_create_database_tables'];?>
</h2>

	<?php $_smarty_tpl->_subTemplateRender('file:messages.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
?>


	<div>
		<?php echo $_smarty_tpl->tpl_vars['LANG']->value['text_install_create_database_tables'];?>

	</div>

	
	<?php if ($_smarty_tpl->tpl_vars['error']->value != '') {?>

		<div class="error" style="padding: 5px; margin-top: 8px">
			<?php echo $_smarty_tpl->tpl_vars['LANG']->value['phrase_error_occurred_c'];?>
<br />
			<br />
			<div class="red"><?php echo $_smarty_tpl->tpl_vars['error']->value;?>
</div>
			<br/>
			<?php echo $_smarty_tpl->tpl_vars['LANG']->value['phrase_check_db_settings_try_again'];?>

		</div>

		<p><b><?php echo $_smarty_tpl->tpl_vars['LANG']->value['word_tips'];?>
</b></p>

		<ul class="tips">
			<li><div><?php echo $_smarty_tpl->tpl_vars['LANG']->value['text_install_db_tables_error_tip_1'];?>
</div></li>
			<li><div><?php echo $_smarty_tpl->tpl_vars['LANG']->value['text_install_db_tables_error_tip_2'];?>
</div></li>
			<li><div><?php echo $_smarty_tpl->tpl_vars['LANG']->value['text_install_db_tables_error_tip_3'];?>
</div></li>
			<li><div><?php echo $_smarty_tpl->tpl_vars['LANG']->value['text_install_db_tables_error_tip_4'];?>
</div></li>
		</ul>

	<?php }?>

	<?php $_smarty_tpl->_subTemplateRender('file:messages.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
?>


	<form name="db_settings_form" action="<?php echo $_smarty_tpl->tpl_vars['same_page']->value;?>
" method="post" onsubmit="return rsv.validate(this, rules);">

		<p><b><?php echo $_smarty_tpl->tpl_vars['LANG']->value['phrase_database_settings'];?>
</b></p>

		<table cellpadding="1" cellspacing="0">
			<tr>
				<td class="label" width="140"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['phrase_database_hostname'];?>
</td>
				<td><input type="text" size="20" name="g_db_hostname" value="<?php echo $_smarty_tpl->tpl_vars['g_db_hostname']->value;?>
" /> <?php echo $_smarty_tpl->tpl_vars['LANG']->value['phrase_often_localhost'];?>
</td>
			</tr>
			<tr>
				<td class="label"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['phrase_database_name'];?>
</td>
				<td><input type="text" size="20" name="g_db_name" value="<?php echo $_smarty_tpl->tpl_vars['g_db_name']->value;?>
" maxlength="64" /></td>
			</tr>
			<tr>
				<td class="label"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['word_port'];?>
</td>
				<td><input type="text" size="20" name="g_db_port" value="<?php echo $_smarty_tpl->tpl_vars['g_db_port']->value;?>
" /></td>
			</tr>
			<tr>
				<td class="label"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['phrase_database_username'];?>
</td>
				<td><input type="text" size="20" name="g_db_username" value="<?php echo $_smarty_tpl->tpl_vars['g_db_username']->value;?>
" /></td>
			</tr>
			<tr>
				<td class="label"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['phrase_database_password'];?>
</td>
				<td><input type="text" size="20" name="g_db_password" value="<?php echo $_smarty_tpl->tpl_vars['g_db_password']->value;?>
" /></td>
			</tr>
			<tr>
				<td class="label"><?php echo $_smarty_tpl->tpl_vars['LANG']->value['phrase_database_table_prefix'];?>
</td>
				<td><input type="text" size="20" maxlength="10" name="g_table_prefix" value="<?php echo $_smarty_tpl->tpl_vars['g_table_prefix']->value;?>
" /></td>
			</tr>
		</table>

		<p>
			<input type="submit" name="create_database" value="<?php echo $_smarty_tpl->tpl_vars['LANG']->value['phrase_create_database_tables'];?>
" />
		</p>
	</form>

	<?php echo '<script'; ?>
 type="text/javascript">
		document.db_settings_form.g_db_hostname.focus();
	<?php echo '</script'; ?>
>

<?php }?>

<?php $_smarty_tpl->_subTemplateRender("file:../../install/templates/install_footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>

<?php }
}
