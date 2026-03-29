import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd
from matplotlib.patches import Polygon

def generate_performance_chart(output_path="performance_analysis.png"):
    # Set Neo-Brutalist Style
    plt.rcParams['font.family'] = 'sans-serif'
    plt.rcParams['font.sans-serif'] = ['Inter', 'Arial']
    
    # 1. Create Dummy Data
    # Time Taken: 10 - 60 minutes
    # Score: 0 - 100%
    np.random.seed(42)
    n_points = 25
    times = np.random.uniform(10, 60, n_points)
    # Generate scores with some negative correlation to time (longer time = often lower score)
    scores = 100 - (times * 1.2) + np.random.normal(0, 15, n_points)
    scores = np.clip(scores, 10, 100)
    
    data = pd.DataFrame({'Time': times, 'Score': scores})

    # 2. Setup Figure
    fig, ax = plt.subplots(figsize=(10, 7), dpi=150)
    fig.patch.set_facecolor('#F5F0E8') # Match Website Background
    ax.set_facecolor('#F5F0E8')

    # 3. Define the Background Zones (Shading)
    # Green Zone (Top-Left): High score, low time
    ax.fill_between([0, 25], 70, 100, color='#00FF57', alpha=0.15, label='Power Users')
    
    # Red Zone (Bottom-Right): Low score, high time
    ax.fill_between([35, 60], 0, 40, color='#F43F5E', alpha=0.15, label='Struggling')
    
    # Yellow Zone (Diagonal Band): Average/Expected
    # We use a polygon to create a diagonal band effect
    poly = Polygon([[0, 0], [60, 100], [60, 60], [20, 0]], color='#FDE047', alpha=0.15, label='Standard Curve')
    # Use a simpler rectangular band for yellow if diagonal is too complex
    ax.add_patch(poly)

    # 4. Create Scatter Plot
    sns.scatterplot(
        data=data, x='Time', y='Score',
        s=200, color='black', marker='o',
        edgecolor='black', linewidth=3,
        zorder=5, ax=ax
    )

    # Add a "Highlight" for the primary user
    ax.scatter([times[0]], [scores[0]], s=400, color='#38BDF8', marker='*', edgecolor='black', linewidth=4, zorder=10, label='Latest Session')

    # 5. Neo-Brutalist Styling
    # Thick Axis Borders
    for spine in ax.spines.values():
        spine.set_linewidth(4)
        spine.set_color('black')
    
    # Text Styling
    ax.set_title("NEURALPATH: PERFORMANCE ANALYSIS", fontsize=24, fontweight='black', pad=20, loc='left', style='italic')
    ax.set_xlabel("TIME INVESTED (MINUTES)", fontsize=14, fontweight='black', labelpad=15)
    ax.set_ylabel("ACCURACY SCORE (%)", fontsize=14, fontweight='black', labelpad=15)
    
    # Grid lines (Dot Pattern Style)
    ax.grid(True, linestyle='--', alpha=0.3, color='black', linewidth=1)
    
    ax.set_xlim(0, 60)
    ax.set_ylim(0, 105)
    
    # Legend Styling
    legend = ax.legend(frameon=True, borderpad=1, fontsize=10)
    legend.get_frame().set_linewidth(3)
    legend.get_frame().set_edgecolor('black')
    legend.get_frame().set_facecolor('white')

    # 6. Save and Finish
    plt.tight_layout()
    plt.savefig(output_path, facecolor=fig.get_facecolor(), bbox_inches='tight')
    print(f"Chart generated successfully: {output_path}")
    plt.close()

if __name__ == "__main__":
    generate_performance_chart()
