// Previous content remains the same up to the return statement

return (
  <div className="grid grid-cols-4 gap-6">
    {/* Tools Panel */}
    <Card className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="text">
            <Type className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="images">
            <ImageIcon className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Layout className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <Button onClick={addText} className="w-full">
            <Type className="h-4 w-4 mr-2" />
            Add Text
          </Button>

          {selectedElement?.type === 'text' && (
            <div className="space-y-4">
              <Input
                value={selectedElement.content}
                onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                placeholder="Enter text"
              />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateElement(selectedElement.id, {
                    fontStyle: selectedElement.fontStyle?.includes('bold') ? 
                      selectedElement.fontStyle.replace('bold', '') : 
                      `${selectedElement.fontStyle || ''} bold`
                  })}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateElement(selectedElement.id, {
                    fontStyle: selectedElement.fontStyle?.includes('italic') ? 
                      selectedElement.fontStyle.replace('italic', '') : 
                      `${selectedElement.fontStyle || ''} italic`
                  })}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateElement(selectedElement.id, {
                    align: selectedElement.align === 'left' ? 'center' : 
                      selectedElement.align === 'center' ? 'right' : 'left'
                  })}
                >
                  {selectedElement.align === 'left' ? <AlignLeft className="h-4 w-4" /> :
                   selectedElement.align === 'center' ? <AlignCenter className="h-4 w-4" /> :
                   <AlignRight className="h-4 w-4" />}
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium">Font Size</label>
                <Slider
                  value={[selectedElement.fontSize || 48]}
                  min={12}
                  max={144}
                  step={1}
                  onValueChange={([value]) => 
                    updateElement(selectedElement.id, { fontSize: value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Font Family</label>
                <select
                  className="w-full mt-1"
                  value={selectedElement.fontFamily}
                  onChange={(e) => 
                    updateElement(selectedElement.id, { fontFamily: e.target.value })
                  }
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Helvetica">Helvetica</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Color</label>
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  >
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: selectedElement.fill }}
                    />
                    {selectedElement.fill}
                  </Button>
                  {showColorPicker && (
                    <div className="absolute z-10 mt-2">
                      <ChromePicker
                        color={selectedElement.fill}
                        onChange={(color) => {
                          updateElement(selectedElement.id, { fill: color.hex });
                          setColor(color.hex);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <div className="space-y-4">
            <Button className="w-full" onClick={() => document.getElementById('image-upload')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  addImage(e.target.files[0]);
                }
              }}
            />

            <Separator />

            <div className="text-sm font-medium mb-2">Stock Photos</div>
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-2 gap-2">
                {/* Sample stock photos */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <img
                    key={i}
                    src={`https://source.unsplash.com/random/300x200?sig=${i}`}
                    alt={`Stock photo ${i}`}
                    className="w-full rounded cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => {
                      const newElement: BrochureElement = {
                        id: `image-${Date.now()}`,
                        type: 'image',
                        x: BROCHURE_WIDTH / 2,
                        y: BROCHURE_HEIGHT / 2,
                        width: 600,
                        height: 400,
                        url: `https://source.unsplash.com/random/300x200?sig=${i}`,
                        draggable: true,
                        zIndex: elements.length,
                      };
                      const newElements = [...elements, newElement];
                      setElements(newElements);
                      addToHistory(newElements);
                      setSelectedId(newElement.id);
                    }}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-2 gap-4">
              {templates.map((template, index) => (
                <Card
                  key={index}
                  className="p-2 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  onClick={() => {
                    setElements(template.elements);
                    addToHistory(template.elements);
                  }}
                >
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full rounded"
                  />
                  <p className="text-sm font-medium mt-2">{template.name}</p>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Grid</label>
              <div className="flex items-center gap-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowGrid(!showGrid)}
                >
                  <Grid className="h-4 w-4 mr-2" />
                  {showGrid ? 'Hide Grid' : 'Show Grid'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSnapToGrid(!snapToGrid)}
                >
                  {snapToGrid ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Grid Size</label>
              <Slider
                value={[gridSize]}
                min={10}
                max={50}
                step={5}
                onValueChange={([value]) => setGridSize(value)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>

    {/* Canvas */}
    <div className="col-span-3">
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex === 0}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex === history.length - 1}>
            <Redo className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline" size="sm" onClick={() => setScale(s => Math.max(0.1, s - 0.1))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <Button variant="outline" size="sm" onClick={() => setScale(s => Math.min(2, s + 0.1))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          {selectedId && (
            <>
              <Button variant="outline" size="sm" onClick={() => duplicateElement(selectedId)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button variant="outline" size="sm" onClick={() => deleteElement(selectedId)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
          <Button variant="outline" onClick={() => onSave(elements)}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button onClick={exportToPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Card className="p-4 overflow-auto bg-gray-100">
        <Stage
          width={BROCHURE_WIDTH * scale}
          height={BROCHURE_HEIGHT * scale}
          scale={{ x: scale, y: scale }}
          onMouseDown={(e) => {
            // Deselect when clicking on empty space
            if (e.target === e.target.getStage()) {
              setSelectedId(null);
            }
          }}
        >
          <Layer>
            {/* Background */}
            <Rect
              width={BROCHURE_WIDTH}
              height={BROCHURE_HEIGHT}
              fill="white"
              shadowColor="rgba(0, 0, 0, 0.15)"
              shadowBlur={20}
              shadowOffset={{ x: 5, y: 5 }}
            />

            {/* Grid */}
            {renderGrid()}

            {/* Fold guides */}
            <Rect
              x={PANEL_WIDTH}
              y={0}
              width={1}
              height={BROCHURE_HEIGHT}
              stroke="#2563eb"
              dash={[5, 5]}
            />
            <Rect
              x={PANEL_WIDTH * 2}
              y={0}
              width={1}
              height={BROCHURE_HEIGHT}
              stroke="#2563eb"
              dash={[5, 5]}
            />

            {/* Elements */}
            {elements
              .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
              .map((element) => {
                if (element.type === 'text') {
                  return (
                    <Text
                      key={element.id}
                      {...element}
                      onClick={() => setSelectedId(element.id)}
                      onTap={() => setSelectedId(element.id)}
                      onDragEnd={(e) => {
                        const pos = e.target.position();
                        if (snapToGrid) {
                          pos.x = Math.round(pos.x / gridSize) * gridSize;
                          pos.y = Math.round(pos.y / gridSize) * gridSize;
                        }
                        updateElement(element.id, pos);
                      }}
                    />
                  );
                }
                if (element.type === 'image') {
                  return (
                    <URLImage
                      key={element.id}
                      {...element}
                      onClick={() => setSelectedId(element.id)}
                      onTap={() => setSelectedId(element.id)}
                      onDragEnd={(e) => {
                        const pos = e.target.position();
                        if (snapToGrid) {
                          pos.x = Math.round(pos.x / gridSize) * gridSize;
                          pos.y = Math.round(pos.y / gridSize) * gridSize;
                        }
                        updateElement(element.id, pos);
                      }}
                    />
                  );
                }
                return null;
              })}

            {/* Transformer */}
            {selectedId && (
              <Transformer
                boundBoxFunc={(oldBox, newBox) => {
                  // Limit resize
                  if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            )}
          </Layer>
        </Stage>
      </Card>
    </div>
  </div>
);