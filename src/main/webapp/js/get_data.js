let getString;
let nodeArray;
let baseNodes;
let baseLinks;
let nodes;
let links;


function updateNode() {
    console.log(getString);
    nodeArray = getString.split(',');

    console.log(nodeArray);
    baseNodes = new Array(parseInt(nodeArray.length/4));

    for(let i =0; i<parseInt(nodeArray.length/4);i++){
        console.log(nodeArray[0]);
        baseNodes[i] = {};
        baseNodes[i].id = nodeArray[4 *i];
        baseNodes[i].group = parseInt(nodeArray[4 *i +1]);
        baseNodes[i].label = nodeArray[4 *i +2];
        baseNodes[i].level = parseInt(nodeArray[4 *i +3]);

    }



    baseLinks = new Array(parseInt(baseNodes.length/2));

    for(let i =0;i<baseLinks.length;i++){
        const link = {};
        link.target = baseNodes[i].id;
        link.source = baseNodes[i+1].id;
        link.strength = 0.1;
        baseLinks[i] = link;
    }



    nodes = [...baseNodes];
    links = [...baseLinks]
}


function callServer(methodType) {
    let xmlResruest;

    if(window.XMLHttpRequest){
        xmlResruest = new XMLHttpRequest();
    }else if(window.ActiveXObject){
        xmlResruest = new ActiveXObject("MICROSOFT.XMLHTTP");
    }

    xmlResruest.onreadystatechange = function(){
        if(xmlResruest.readyState === 4 && xmlResruest.status === 200){
            document.getElementById("myDiv").innerHTML = "button down";
            getString = xmlResruest.responseText;
            document.getElementById("myDiv").innerHTML = getString;
            updateNode();
            updateSimulation();
        }

    };

    let params = "comment=" + "value";
    if(methodType === "GET"){
        xmlResruest.open("GET","/DaCeMo_war_exploded/getGraph?"+params,true);
        xmlResruest.send();

    }else if(methodType === "POST"){
        xmlResruest.open("POST","/DaCeMo_war_exploded/getGraph",true);
        xmlResruest.setRequestHeader("req","req");
        xmlResruest.send(params);

    }

}


function getNeighbors(node) {
    return baseLinks.reduce(function (neighbors, link) {
            if (link.target.id === node.id) {
                neighbors.push(link.source.id)
            } else if (link.source.id === node.id) {
                neighbors.push(link.target.id)
            }
            return neighbors
        },
        [node.id]
    )
}

function isNeighborLink(node, link) {
    return link.target.id === node.id || link.source.id === node.id
}


function getNodeColor(node, neighbors) {
    if (Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1) {
        return node.level === 1 ? 'blue' : 'green'
    }

    return node.level === 1 ? 'red' : 'gray'
}


function getLinkColor(node, link) {
    return isNeighborLink(node, link) ? 'green' : '#E5E5E5'
}

function getTextColor(node, neighbors) {
    return Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1 ? 'green' : 'black'
}

const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select('svg');
svg.attr('width', width).attr('height', height);

let linkElements,
    nodeElements,
    textElements;

// we use svg groups to logically group the elements together
const linkGroup = svg.append('g').attr('class', 'links');
const nodeGroup = svg.append('g').attr('class', 'nodes');
const textGroup = svg.append('g').attr('class', 'texts');

// we use this reference to select/deselect
// after clicking the same element twice
let selectedId;

// simulation setup with all forces
const linkForce = d3
    .forceLink()
    .id(function (link) {
        return link.id
    })
    .strength(function (link) {
        return link.strength
    });

const simulation = d3
    .forceSimulation()
    .force('link', linkForce)
    .force('charge', d3.forceManyBody().strength(-120))
    .force('center', d3.forceCenter(width / 2, height / 2));

const dragDrop = d3.drag().on('start', function (node) {
    node.fx = node.x;
    node.fy = node.y
}).on('drag', function (node) {
    simulation.alphaTarget(0.7).restart();
    node.fx = d3.event.x;
    node.fy = d3.event.y
}).on('end', function (node) {
    if (!d3.event.active) {
        simulation.alphaTarget(0)
    }
    node.fx = null;
    node.fy = null
});

// select node is called on every click
// we either update the data according to the selection
// or reset the data if the same node is clicked twice
function selectNode(selectedNode) {
    if (selectedId === selectedNode.id) {
        selectedId = undefined;
        resetData();
        updateSimulation()
    } else {
        selectedId = selectedNode.id;
        updateData(selectedNode);
        updateSimulation()
    }

    const neighbors = getNeighbors(selectedNode);

    // we modify the styles to highlight selected nodes
    nodeElements.attr('fill', function (node) { return getNodeColor(node, neighbors) });
    textElements.attr('fill', function (node) { return getTextColor(node, neighbors) });
    linkElements.attr('stroke', function (link) { return getLinkColor(selectedNode, link) })
}

// this helper simple adds all nodes and links
// that are missing, to recreate the initial state
function resetData() {
    const nodeIds = nodes.map(function (node) {
        return node.id
    });

    baseNodes.forEach(function (node) {
        if (nodeIds.indexOf(node.id) === -1) {
            nodes.push(node)
        }
    });

    links = baseLinks
}

// diffing and mutating the data
function updateData(selectedNode) {
    const neighbors = getNeighbors(selectedNode);
    const newNodes = baseNodes.filter(function (node) {
        return neighbors.indexOf(node.id) > -1 || node.level === 1
    });

    const diff = {
        removed: nodes.filter(function (node) {
            return newNodes.indexOf(node) === -1
        }),
        added: newNodes.filter(function (node) {
            return nodes.indexOf(node) === -1
        })
    };

    diff.removed.forEach(function (node) { nodes.splice(nodes.indexOf(node), 1) });
    diff.added.forEach(function (node) { nodes.push(node) });

    links = baseLinks.filter(function (link) {
        return link.target.id === selectedNode.id || link.source.id === selectedNode.id
    })
}

function updateGraph() {
    // links
    linkElements = linkGroup.selectAll('line')
        .data(links, function (link) {
            return link.target.id + link.source.id
        });

    linkElements.exit().remove();

    const linkEnter = linkElements
        .enter().append('line')
        .attr('stroke-width', 1)
        .attr('stroke', 'rgba(50, 50, 50, 0.2)');

    linkElements = linkEnter.merge(linkElements);

    // nodes
    nodeElements = nodeGroup.selectAll('circle')
        .data(nodes, function (node) { return node.id });

    nodeElements.exit().remove();

    const nodeEnter = nodeElements
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('fill', function (node) {
            return node.level === 1 ? 'red' : 'gray'
        })
        .call(dragDrop)
        // we link the selectNode method here
        // to update the graph on every click
        .on('click', selectNode);

    nodeElements = nodeEnter.merge(nodeElements);

    // texts
    textElements = textGroup.selectAll('text')
        .data(nodes, function (node) { return node.id });

    textElements.exit().remove();

    const textEnter = textElements
        .enter()
        .append('text')
        .text(function (node) {
            return node.label
        })
        .attr('font-size', 15)
        .attr('dx', 15)
        .attr('dy', 4);

    textElements = textEnter.merge(textElements)
}

function updateSimulation() {
    updateGraph();

    simulation.nodes(nodes).on('tick', () => {
        nodeElements
        .attr('cx', function (node) { return node.x })
            .attr('cy', function (node) { return node.y });
        textElements
        .attr('x', function (node) { return node.x })
            .attr('y', function (node) { return node.y });
        linkElements
        .attr('x1', function (link) { return link.source.x })
            .attr('y1', function (link) { return link.source.y })
            .attr('x2', function (link) { return link.target.x })
            .attr('y2', function (link) { return link.target.y })
    });

    simulation.force('link').links(links);
    simulation.alphaTarget(0.7).restart()
}

// last but not least, we call updateSimulation
// to trigger the initial render