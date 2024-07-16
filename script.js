const components = document.querySelectorAll('.draggable');
const assemblyArea = document.getElementById('assembly-area');
const processButton = document.getElementById('process-instructions');
const output = document.getElementById('output');
const instructionText = document.getElementById('instruction-text');
const clockSpeed = document.getElementById('clock-speed');
const memoryCapacity = document.getElementById('memory-capacity');

components.forEach(component => {
    component.addEventListener('dragstart', dragStart);
});

assemblyArea.addEventListener('dragover', dragOver);
assemblyArea.addEventListener('drop', drop);

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.type);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('text');
    const newComponent = document.createElement('div');
    newComponent.className = 'component';
    newComponent.textContent = componentType.toUpperCase();
    assemblyArea.appendChild(newComponent);
}

processButton.addEventListener('click', processInstructions);

function processInstructions() {
    const components = assemblyArea.children;
    if (components.length < 3) {
        output.textContent = "Please add at least CPU, Memory, and I/O components before processing instructions.";
        return;
    }

    const instructions = instructionText.value.split('\n').filter(instruction => instruction.trim() !== '');
    if (instructions.length === 0) {
        output.textContent = "Please enter at least one instruction.";
        return;
    }

    const speed = parseFloat(clockSpeed.value);
    const memory = parseInt(memoryCapacity.value);

    let outputText = `System Configuration:\n`;
    outputText += `Clock Speed: ${speed} GHz\n`;
    outputText += `Memory Capacity: ${memory} GB\n\n`;
    outputText += `Processing ${instructions.length} instruction(s):\n\n`;

    instructions.forEach((instruction, index) => {
        outputText += `Instruction ${index + 1}: ${instruction}\n`;
        outputText += `1. Fetch instruction from memory\n`;
        outputText += `2. Decode instruction in CPU\n`;
        outputText += `3. Execute instruction\n`;
        if (instruction.toLowerCase().includes('gpu')) {
            outputText += `4. Offload computation to GPU\n`;
        }
        if (instruction.toLowerCase().includes('store') || instruction.toLowerCase().includes('save')) {
            outputText += `4. Store result in storage\n`;
        } else {
            outputText += `4. Store result in memory or output through I/O\n`;
        }
        outputText += `\n`;
    });

    const totalTime = (instructions.length * (1 / speed)).toFixed(2);
    outputText += `Total processing time: ${totalTime} seconds\n`;

    output.textContent = outputText;
}

// Add tooltips to components
components.forEach(component => {
    component.setAttribute('title', getComponentDescription(component.dataset.type));
});

function getComponentDescription(type) {
    const descriptions = {
        cpu: "Central Processing Unit: The brain of the computer that performs calculations and executes instructions.",
        memory: "Random Access Memory (RAM): Temporary storage for data and instructions that the CPU needs to access quickly.",
        io: "Input/Output: Manages communication between the computer and external devices or networks.",
        gpu: "Graphics Processing Unit: Specialized processor for rendering images, video, and 3D graphics.",
        storage: "Storage: Long-term data storage, such as hard drives or solid-state drives."
    };
    return descriptions[type] || "Component of a computer system";
}