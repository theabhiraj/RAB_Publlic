import html2canvas from 'html2canvas';

export const exportCanvasAsImage = async (
  canvasElement: HTMLElement,
  fileName: string = 'home-layout.png'
): Promise<void> => {
  try {
    // Create canvas from the element
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
    });

    // Convert to blob
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Failed to create image blob');
        return;
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (error) {
    console.error('Error exporting image:', error);
    throw error;
  }
};

export const exportCanvasAsJPG = async (
  canvasElement: HTMLElement,
  fileName: string = 'home-layout.jpg'
): Promise<void> => {
  try {
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
    });

    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Failed to create image blob');
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/jpeg', 0.95);
  } catch (error) {
    console.error('Error exporting image:', error);
    throw error;
  }
};
