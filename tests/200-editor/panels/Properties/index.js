PropertiesPanel = IgeClass.extend({
	init: function (panelBar) {
		// Add the panel
		var self = this,
			container = $($("#tabStrip").data('kendoTabStrip').contentElement(1));

		container.html($('<div id="propertiesContent" style="padding: 5px;">No object selected, use the SceneGraph panel to select an object.</div>'));

		// Listen to the scenegraph panel for selection events
		editor.panel('sceneGraph').on('selectedObject', function (obj) {
			self.selectObject(obj);
		});
	},

	selectObject: function (obj) {
		$('#propertiesContent').html('Loading...');
		$.ajax({
			url: "panels/Properties/properties.html",
			success: function (data) {
				var treeView = $("#scenegraph-treeview").data('kendoTreeView'),
					onValueChange;

				$('#propertiesContent').html('');

				onValueChange = function () {
					switch (this.element[0].id) {
						case 'layer':
							obj.layer(parseFloat(this.element.val()));
							break;
						case 'depth':
							obj.depth(parseFloat(this.element.val()));
							break;
						case 'translateX':
							obj._translate.x = parseFloat(this.element.val());
							break;
						case 'translateY':
							obj._translate.y = parseFloat(this.element.val());
							break;
						case 'translateZ':
							obj._translate.z = parseFloat(this.element.val());
							break;

						case 'rotateX':
							obj._rotate.x = parseFloat(this.element.val());
							break;
						case 'rotateY':
							obj._rotate.y = parseFloat(this.element.val());
							break;
						case 'rotateZ':
							obj._rotate.z = parseFloat(this.element.val()) * Math.PI / 180;
							break;

						case 'scaleX':
							obj._scale.x = parseFloat(this.element.val());
							break;
						case 'scaleY':
							obj._scale.y = parseFloat(this.element.val());
							break;
						case 'scaleZ':
							obj._scale.z = parseFloat(this.element.val());
							break;

						case 'originX':
							obj._origin.x = parseFloat(this.element.val());
							break;
						case 'originY':
							obj._origin.y = parseFloat(this.element.val());
							break;
						case 'originZ':
							obj._origin.z = parseFloat(this.element.val());
							break;
					}
				};

				$('#propertiesContent').append(data);
				$('#propertiesContent .numberBox').kendoNumericTextBox({
					spin: onValueChange,
					change: onValueChange
				});

				// Panel bars
				$("#propertiesContent .objectControlPanel").kendoPanelBar({
					expandMode: "multiple"
				});

				// Object ID apply button
				$('#propertiesContent #objectIdApply').click(function () {
					obj.id($('#propertiesContent #objectId').val());
					$('.k-in', treeView.select()).html(obj.id() + ' (' + obj._classId + ')');
					treeView.dataItem(treeView.select()).set('id', obj.id());
				});

				// Positioning mode drop-down
				$("#positioning").kendoDropDownList({
					dataSource: [
						{value: 0, text:'2d'},
						{value: 1, text:'Isometric'}
					],
					dataTextField: 'text',
					dataValueField: 'value',
					index: obj.isometric() === true ? 1 : 0,
					change: function () {
						obj.isometric(this.value() === 1 ? true : false);
					}
				});

				// Child depth-sort drop-down
				$("#childDepthSort").kendoDropDownList({
					dataSource: [
						{value: 0, text:'2d'},
						{value: 1, text:'Isometric'}
					],
					dataTextField: 'text',
					dataValueField: 'value',
					index: obj.isometricMounts() === true ? 1 : 0,
					change: function () {
						obj.isometricMounts(this.value() === 1 ? true : false);
					}
				});

				// Set the correct initial data
				$('#propertiesContent #objectId').val(obj.id());
				$('#propertiesContent #layer').data("kendoNumericTextBox").value(obj.layer());
				$('#propertiesContent #depth').data("kendoNumericTextBox").value(obj.depth());

				$('#propertiesContent #translateX').data("kendoNumericTextBox").value(obj._translate.x);
				$('#propertiesContent #translateY').data("kendoNumericTextBox").value(obj._translate.y);
				$('#propertiesContent #translateZ').data("kendoNumericTextBox").value(obj._translate.z);

				$('#propertiesContent #rotateX').data("kendoNumericTextBox").value(obj._rotate.x);
				$('#propertiesContent #rotateY').data("kendoNumericTextBox").value(obj._rotate.y);
				$('#propertiesContent #rotateZ').data("kendoNumericTextBox").value(obj._rotate.z * 180 / Math.PI);

				$('#propertiesContent #scaleX').data("kendoNumericTextBox").value(obj._scale.x);
				$('#propertiesContent #scaleY').data("kendoNumericTextBox").value(obj._scale.y);
				$('#propertiesContent #scaleZ').data("kendoNumericTextBox").value(obj._scale.z);

				$('#propertiesContent #originX').data("kendoNumericTextBox").value(obj._origin.x);
				$('#propertiesContent #originY').data("kendoNumericTextBox").value(obj._origin.y);
				$('#propertiesContent #originZ').data("kendoNumericTextBox").value(obj._origin.z);
			},
			dataType: 'html'
		});
	}
});

editor.panel('properties', PropertiesPanel);