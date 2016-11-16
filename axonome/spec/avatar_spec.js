var avatar;
var grid;
var node;
Screw.Unit(function(c) { with(c) {
  describe('Avatar', function() {
    before(function() {
      grid = new Grid(3,3,defaults);
      avatar = new Avatar(grid,defaults);
      node = grid.nodes["0_0_0"];
    });
    
    it('know its position on a grid', function() {
      expect(avatar.position).to(equal,[0,0,0]);
    });
    
    it('has a zindex', function() {
      expect(avatar.zindex()).to(equal,node.zindex + 10000);
    });
    
    it('can determine its xy pixel coords', function() {
      expect(avatar.left()).to(equal,node.left);
      expect(avatar.top()).to(equal,node.top);
    });
    
    it('belongs to a node on a grid', function() {
      expect(avatar.node()).to(equal,node);
    });
    
    it('can come up with a path if given start and end coordinates', function() {
      avatar.determine_path(0,0,2,2,0);
      var expected_path = [[1,1,0], [2,2,0]];
      expect(avatar.movement_queue).to(equal, expected_path);
    });
    
    it('can change its position, one path node at a time, until it reaches the end', function() {
      avatar.determine_path(0,0,2,2,0);
      avatar.step();
      expect(avatar.node()).to(equal,grid.nodes["1_1_0"]);
      expect(avatar.position).to(equal, [1,1,0]);
      avatar.step();
      expect(avatar.node()).to(equal,grid.nodes["2_2_0"]);
      expect(avatar.position).to(equal, [2,2,0]);
    });
    
    it('can follow a path, then follow a new one', function() {
      avatar.determine_path(0,0,2,2,0);
      avatar.follow();
      expect(avatar.position).to(equal, [2,2,0]);
      avatar.determine_path(2,2,0,0,0);
      avatar.follow();
      expect(avatar.position).to(equal, [0,0,0]);
    });
    
    describe('a* performance', function() {
      before(function() {
        grid = new Grid(100,100,defaults);
        avatar = new Avatar(grid,defaults);
        avatar.grid = grid;
      });
      
      it('can haul ass', function() {
        avatar.determine_path(0,0,22,88,0);
        avatar.follow();
      })
    });
    
    describe("Multiple avatars", function() {
      var avatar_a;
      var avatar_b;
      var avatars_grid;
      var board;
      before(function() {
        $j('#board').remove();
        $j('body').append('<div id="board"></div>');
        board = $j('#board').iso({avatar_count: 2});
        avatar_a = board.iso.avatars[0];
        avatar_b = board.iso.avatars[1];
      });
      
      it('avatars can be positioned independently', function() {
        expect(avatar_a.position).to(equal,[0,0,0]);
        expect(avatar_b.position).to(equal,[0,0,0]);
        
        avatar_a.determine_path(0,0,2,2,0);
        avatar_a.follow();
        expect(avatar_a.position).to(equal, [2,2,0]);
        
        avatar_b.determine_path(0,0,0,2,0);
        avatar_b.follow();
        expect(avatar_b.position).to(equal, [0,2,0]);
        $j('#board').remove();
      });
    });
  });
}});