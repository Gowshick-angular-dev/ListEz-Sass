import React,{FC} from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import styled from '@emotion/styled';

const TreeChart: FC = () => {

    const StyledNode = styled.div`
    padding: 5px;
    border-radius: 0px;
    display: inline-block;
    border: 1px solid #ff6700;
    `;

    return(
        // <div>
            <Tree
                lineWidth={'2px'}
                lineColor={'#ff6700'}
                lineBorderRadius={'10px'}
                label={<StyledNode>Admin</StyledNode>}
            >
                <TreeNode label={<StyledNode>Sales Head 1</StyledNode>}>
                    <TreeNode label={<StyledNode>Nirmal</StyledNode>} />
                </TreeNode>
                <TreeNode label={<StyledNode>Sales Head 2</StyledNode>}>
                    <TreeNode label={<StyledNode>David</StyledNode>}>
                        <TreeNode label={<StyledNode>Murugan</StyledNode>} />
                        <TreeNode label={<StyledNode>Dennis</StyledNode>} />
                    </TreeNode>
                </TreeNode>
                <TreeNode label={<StyledNode>Sales Head 3</StyledNode>}>
                    <TreeNode label={<StyledNode>Chandru</StyledNode>} />
                    <TreeNode label={<StyledNode>Dharma</StyledNode>} />
                </TreeNode>
            </Tree>
        // </div>
    )
}
export{TreeChart}
